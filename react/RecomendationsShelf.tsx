import React, { useState, useEffect } from 'react';
import { useCssHandles } from "vtex.css-handles";
import styled from 'styled-components';
import { useOrderItems } from 'vtex.order-items/OrderItems';
import { useProduct } from 'vtex.product-context'


import ShelfItem from './components/ShelfItem'
import { formatPrice } from './helpers/Helper'

const CSS_HANDLES = ["containerShelf", "buttonText"]

const RecomendationsShelf = () => {
    const productContext = useProduct();
    const { addItems } = useOrderItems();
    const [loading, setLoading] = useState<boolean>(false);
    const handles = useCssHandles(CSS_HANDLES)
    const [arrayProducts, setArrayProducts] = useState([]) as any
    const [skuSelection, setSkuSelection] = useState<Array<any>>(Array.from({ length: 4 }).fill(0))
    const [skuNames, setSkuNames] = useState<Array<any>>([
        { productName: '', Tamanho: 'P', Cor: '' },
        { productName: '', Tamanho: 'P', Cor: '' },
        { productName: '', Tamanho: 'P', Cor: '' },
        { productName: '', Tamanho: 'P', Cor: '' }
    ])


    // Puxa as sugestões na API do backend e; 
    // seleciona na API de catálogo somente os produtos que são sugestão para o produto do contexto
    const getItems = async () => {
        const idContext = productContext?.product?.productId
        const suggestions = await fetch(`https://bitsized.socialfitness.com.br/api/suggestion?productId=${idContext}`)
        const { data } = await suggestions.json()
        console.log('DATA', data)

        const productsIds = [productContext?.product?.productId]
        data.map((product: any) => {
            productsIds.push(product?.suggestedId)
        })
        console.log(`SUGESTÕES ${'2'}`, productsIds)


        const productsList: any[] = []
        for (let i = 0; i < productsIds.length; i++) {

            await fetch(`/api/catalog_system/pub/products/search?fq=productId:${productsIds[i]}`)
                .then((response) => response.json())
                .then((data) => {
                    productsList.push(data[0])
                })
        }

        console.log('LISTA:', productsList)
        setArrayProducts(productsList)
        setLoading(true)

    }
    console.log('type of arrayProducts: ', typeof (arrayProducts))
    console.log('arrayProducts', arrayProducts)
    console.log('productContext', productContext) 


    // funcao que adiciona todos os produtos da combinacao no carrinho
    const addToCart = async (element: any) => {
        const ids = element.target.id.split("-")
        // alert(ids)        

        await ids.map((product: any) => {
            const productIndex = arrayProducts.findIndex((x: any) => x.productId === product)
            // alert(productIndex)

            fetch(`/api/catalog_system/pub/products/search?fq=productId:${product}`)
                .then((response) => response.json())
                .then((data) => {
                    populateCart(data, skuSelection[productIndex])
                })
        })



    }

    // Adicionando informações sobre cada produto que está sendo add no carrinho
    const populateCart = (data: any, itemId: number) => {

        const cart = [
            {
                additionalInfo: {
                    brandName: data[0].brand,
                    __typename: 'ItemAdditionalInfo',
                },
                availability: data[0].items[itemId].sellers[0].commertialOffer.IsAvailable,
                id: data[0].items[itemId].itemId,
                imageUrls: {
                    at1x: data[0].items[itemId].images[0].imageUrl,
                    __typename: 'ImageUrls',
                },
                listPrice: data[0].items[itemId].sellers[0].commertialOffer.ListPrice,
                measurementUnit: data[0].items[itemId].measurementUnit,
                name: data[0].productName,
                price: data[0].items[itemId].sellers[0].commertialOffer.Price,
                productId: data[0].productId,
                quantity: 1,
                seller: data[0].items[itemId].sellers[0].sellerId,
                skuName: data[0].items[itemId].nameComplete,
                uniMultiplier: data[0].items[itemId].unitMultiplier,
                uniqueId: data[0].items[itemId].itemId,
                isGift: false,
                __typename: 'Item',
            }
        ]

        addItems(cart)
    }

    const customSku = (element: any) => {
        const split = element.target.id.split("-")
        const skuID = split[0]
        const id = split[1]
        const productIndex = arrayProducts.findIndex((x: any) => x.productId === id)
        const valueID = split[2]


        let currentItemObj = { ...skuNames }

        if (valueID === '0') {
            currentItemObj[productIndex].productName = `${arrayProducts[productIndex].productName}`
            currentItemObj[productIndex].Tamanho = skuID
            setSkuNames(currentItemObj)
        } else {
            currentItemObj[productIndex].productName = `${arrayProducts[productIndex].productName}`
            currentItemObj[productIndex].Cor = skuID
            setSkuNames(currentItemObj)
        }

        let itemFinalName = (`${currentItemObj[productIndex].productName} ${currentItemObj[productIndex].Tamanho} ${currentItemObj[productIndex].Cor}`)
        itemFinalName = itemFinalName.trim().replace(/\s{2,}/g, ' ')
        let wordsList = itemFinalName.split(" ")
        wordsList = wordsList.sort()
        for (let i: any = 0; i < wordsList.length; i++) {
            let word = wordsList[i]
            wordsList[i] = word.substring(0, 3)
        }
        const finalName = wordsList.join(" ")

        arrayProducts[productIndex].items.map((skuChoice: any, index: any) => {
            let itemName = skuChoice.name.trim().replace(/\s{2,}/g, ' ')
            let arrayItemVerification = itemName.split(" ")
            arrayItemVerification = arrayItemVerification.sort()
            for (let i: any = 0; i < arrayItemVerification.length; i++) {
                let word = arrayItemVerification[i]
                arrayItemVerification[i] = word.substring(0, 3)
            }
            const finalOptionName = arrayItemVerification.join(" ")
            // alert(`Seleção: ${finalName} VS ${finalOptionName} index: ${index}`)


            if (finalName === finalOptionName) {

                let skuArray = [...skuSelection]
                skuArray[productIndex] = index
                // alert(`DEU MATCH: ${skuArray}`)


                setSkuSelection(skuArray)
            }
        })

    }

    const renderProducts = (current: any, target: any): React.ReactElement[] => {
        const productBlocks: React.ReactElement[] = []
        const array = [arrayProducts[current], arrayProducts[target]]
        array.forEach((product: any, index: number) => (
            productBlocks.push(
                <div>
                    {index === 0 ?
                        <PlusImage className='plus-image'>
                            <ContainerProduct className='container-product'>
                                <ShelfItem
                                    linkURL={product.link}
                                    id={product.productId}
                                    imageURL={product.items[skuSelection[arrayProducts.findIndex((x: any) => x.productId === product.productId)]].images[0].imageUrl}
                                    name={product.productName}
                                    noDiscount={product.items[0].sellers[0].commertialOffer.PriceWithoutDiscount}
                                    price={product.items[skuSelection[arrayProducts.findIndex((x: any) => x.productId === product.productId)]].sellers[0].commertialOffer.Price}
                                />
                                {/* ------------------------- SKU's --------------------------------------- */}
                                {product.skuSpecifications !== undefined ?
                                    product.skuSpecifications.map((sku: any) => (
                                        <SkusBlock>
                                            {sku.field?.name === 'Tamanho' ?
                                                <Sku>
                                                    <p>{sku.field.name}</p>
                                                    <ItemContainer>
                                                        {sku.values.map((skuValue: any) => (
                                                            <DivSKU>
                                                                <SkuButton type='radio' name={`${array[index].productId} sku1`} id={`${skuValue.name}-${array[index].productId}-0`} onClick={customSku} />
                                                                <SkuLabel htmlFor={`${array[index].productId} sku1`}>{skuValue.name}</SkuLabel>
                                                            </DivSKU>
                                                        ))}
                                                    </ItemContainer>
                                                </Sku>
                                                :
                                                <Sku>
                                                    <p>{sku.field.name}</p>
                                                    <ItemContainer>
                                                        {sku.values.map((skuValue: any) => (
                                                            <DivSKU>
                                                                <SkuButton type='radio' name={`${array[index].productId} sku2`} id={`${skuValue.name}-${array[index].productId}-1`} onClick={customSku} />
                                                                <SkuLabel htmlFor={`${array[index].productId} sku2`}>{skuValue.name}</SkuLabel>
                                                            </DivSKU>
                                                        ))}
                                                    </ItemContainer>
                                                </Sku>
                                            }

                                        </SkusBlock>
                                    ))
                                    : <div></div>}
                                {/* ----------------------------------------------------------------------------- */}
                            </ContainerProduct>
                        </PlusImage>
                        : index === (array.length - 1) ?
                            <PlusImage className='plus-image'>
                                <div><BigText className='big-text'>+</BigText></div>
                                <ContainerProduct className='container-product'>
                                    <ShelfItem
                                        linkURL={product.link}
                                        id={product.productId}
                                        imageURL={product.items[skuSelection[arrayProducts.findIndex((x: any) => x.productId === product.productId)]].images[0].imageUrl}
                                        name={product.productName}
                                        noDiscount={product.items[0].sellers[0].commertialOffer.PriceWithoutDiscount}
                                        price={product.items[skuSelection[arrayProducts.findIndex((x: any) => x.productId === product.productId)]].sellers[0].commertialOffer.Price}
                                    />
                                    {/* ------------------------- SKU's --------------------------------------- */}
                                    {product.skuSpecifications !== undefined ?
                                        product.skuSpecifications?.map((sku: any) => (
                                            <SkusBlock>
                                                {sku.field?.name === 'Tamanho' ?
                                                    <Sku>
                                                        <p>{sku.field.name}</p>
                                                        <ItemContainer>
                                                            {sku.values.map((skuValue: any) => (
                                                                <DivSKU>
                                                                    <SkuButton type='radio' name={`${array[index].productId} sku1`} id={`${skuValue.name}-${array[index].productId}-0`} onClick={customSku} />
                                                                    <SkuLabel htmlFor={`${array[index].productId} sku1`}>{skuValue.name}</SkuLabel>
                                                                </DivSKU>
                                                            ))}
                                                        </ItemContainer>
                                                    </Sku>
                                                    :
                                                    <Sku>
                                                        <p>{sku.field.name}</p>
                                                        <ItemContainer>
                                                            {sku.values.map((skuValue: any) => (
                                                                <DivSKU>
                                                                    <SkuButton type='radio' name={`${array[index].productId} sku2`} id={`${skuValue.name}-${array[index].productId}-1`} onClick={customSku} />
                                                                    <SkuLabel htmlFor={`${array[index].productId} sku2`}>{skuValue.name}</SkuLabel>
                                                                </DivSKU>
                                                            ))}
                                                        </ItemContainer>
                                                    </Sku>
                                                }

                                            </SkusBlock>
                                        ))
                                        : <div></div>}
                                    {/* ----------------------------------------------------------------------------- */}
                                </ContainerProduct>
                                <div><BigText className='big-text'>=</BigText></div>
                                <TotalPrice className='total-price'>
                                    <BigText>{array.length !== undefined ?
                                        `Leve os ${array.length} produtos`
                                        :
                                        "Leve todos os produtos"}</BigText>
                                    <SmallText>E poupe seu precioso tempo</SmallText>
                                    {(array[0].items[0].sellers[0].commertialOffer.Price + array[1].items[0].sellers[0].commertialOffer.Price) < (array[0].items[0].sellers[0].commertialOffer.PriceWithoutDiscount + array[1].items[0].sellers[0].commertialOffer.PriceWithoutDiscount) ? 
                                        <TotalDiscount>{formatPrice((array[0].items[0].sellers[0].commertialOffer.PriceWithoutDiscount) + (array[1].items[0].sellers[0].commertialOffer.PriceWithoutDiscount))}</TotalDiscount>
                                        :
                                        null}
                                    <BigText>{formatPrice(array[0].items[0].sellers[0].commertialOffer.Price + array[1].items[0].sellers[0].commertialOffer.Price)}</BigText>
                                    <CartButton id={`${array[0].productId}-${array[1].productId}`} onClick={addToCart} className='button' >
                                        ADICIONAR TUDO AO CARRINHO 
                                    </CartButton>
                                </TotalPrice>
                            </PlusImage>
                            :
                            <PlusImage className='plus-image'>
                                <div><BigText className='big-text'>+</BigText></div>
                                <ContainerProduct className='container-product'>
                                    <ShelfItem
                                        linkURL={product.link}
                                        id={product.productId}
                                        imageURL={product.items[skuSelection[arrayProducts.findIndex((x: any) => x.productId === product.productId)]].images[0].imageUrl}
                                        name={product.productName}
                                        noDiscount={product.items[0].sellers[0].commertialOffer.PriceWithoutDiscount}
                                        price={product.items[skuSelection[arrayProducts.findIndex((x: any) => x.productId === product.productId)]].sellers[0].commertialOffer.Price}
                                    />
                                    {/* ------------------------- SKU's --------------------------------------- */}
                                    {product.skuSpecifications !== undefined ?
                                        product.skuSpecifications.map((sku: any) => (
                                            <SkusBlock>
                                                {sku.field?.name === 'Tamanho' ?
                                                    <Sku>
                                                        <p>{sku.field.name}</p>
                                                        <ItemContainer>
                                                            {sku.values.map((skuValue: any) => (
                                                                <DivSKU>
                                                                    <SkuButton type='radio' name={`${array[index].productId} sku1`} id={`${skuValue.name}-${array[index].productId}-0`} onClick={customSku} />
                                                                    <SkuLabel htmlFor={`${array[index].productId} sku1`}>{skuValue.name}</SkuLabel>
                                                                </DivSKU>
                                                            ))}
                                                        </ItemContainer>
                                                    </Sku>
                                                    :
                                                    <Sku>
                                                        <p>{sku.field.name}</p>
                                                        <ItemContainer>
                                                            {sku.values.map((skuValue: any) => (
                                                                <DivSKU>
                                                                    <SkuButton type='radio' name={`${array[index].productId} sku2`} id={`${skuValue.name}-${array[index].productId}-1`} onClick={customSku} />
                                                                    <SkuLabel htmlFor={`${array[index].productId} sku2`}>{skuValue.name}</SkuLabel>
                                                                </DivSKU>
                                                            ))}
                                                        </ItemContainer>
                                                    </Sku>
                                                }

                                            </SkusBlock>
                                        ))
                                        : <div></div>}
                                    {/* ----------------------------------------------------------------------------- */}
                                </ContainerProduct>
                            </PlusImage>
                    }
                </div>
            )
        ))
        return productBlocks
    }




    useEffect(() => {
        getItems()
    }, [productContext])

    // Renderiza na pdp
    if (arrayProducts.length <= 1) {

        return null
        
    } else {
        return (
            <Container className={`${handles.containerShelf} container`}>
                <Title>
                    <h1>Compre Junto</h1>
                    <p>Quer saber o que levar junto com {productContext?.product?.productName}?</p>
                    {arrayProducts.length === 2 ? 
                        <p>Preparamos uma sugestão pra você!</p>
                        :
                        <p>Preparamos algumas sugestões para você!</p> }
                </Title>
                {arrayProducts && loading ?
                    [1, 2, 3, 4, 5, 6, 7, 8, 9].slice(0, (arrayProducts.length -1)).map(block => (
                        <ItemContainer className='item-container'>
                            {renderProducts(0, block)}
                        </ItemContainer>
                    ))

                    : <Loading>Carregando sugestões...</Loading>}
            </Container>
        )
    }
}

// ------------------------------------ CSS styled components
const TotalDiscount = styled.p`
    text-decoration: line-through;
    color: #727273;
    font-size: smaller;
`
const Loading = styled.h3`
    text-align: center;
    font-family: San Francisco,-apple-system,BlinkMacSystemFont,avenir next,avenir,ubuntu,roboto,noto,segoe ui;
`

const Title = styled.div`
    text-align: center;
    color: #3f3f40;
`

const BigText = styled.h2`
    color: #3f3f40;
`
const SmallText = styled.p`
    color: #3f3f40;
`

const SkusBlock = styled.div`
       
`
const Sku = styled.div`
    max-height: 90px;
    min-height: 90px;
`

const Container = styled.div` 
    max-width: 1280px;  
    margin: 0 auto;

    @media(max-width: 768px) {
    .item-container{
    flex-direction: column;
    }
    .plus-image{
        flex-direction: column;
    }
   
    .container-product h4{
        font-size:15px;
    }
    
  } 
  
    @media(max-width: 425px) {
    .item-container{
    flex-direction: column;
    }
    .plus-image{
        flex-direction: column;
    }
    
  } 
`
const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    @media(max-width: 1280px) {
    display: flex;
    flex-wrap: wrap;
    font-size: 11px;
    }
    @media(max-width: 600px) {
    display: flex;
    flex-wrap: wrap;
    font-size: 11px;
    }

`
const PlusImage = styled.div`
    display: flex;
    align-items: center;
    
`
const TotalPrice = styled.div`
    padding: 10px;
    size: 345px;
    text-align: center;
`
const ContainerProduct = styled.div` 
    max-height: 700px;
    min-height: 700px;
    @media(max-width: 768px) {
    max-height: 700px;
    min-height: 700px;
    }
    @media(max-width: 425px) {
    max-height: 500px;
    min-height: 500px;
    }
`
const CartButton = styled.div`
    display: flex;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 20px;
    font-family: San Francisco,-apple-system,BlinkMacSystemFont,avenir next,avenir,ubuntu,roboto,noto,segoe ui;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
    text-decoration: none;

    color: white;
    background-color: #8719a8;
    border-color: #ccc;
    transition:800ms;

    &:hover.button {
        background-color: #8955ff;
        transition:800ms;
    } 
    @media(max-width: 1129px) {
        font-size: 15px;
    }
    
    @media(max-width: 768px) {
        font-size: 12px;
    }
    @media(max-width: 650px) {
        font-size: 12px;
    }
    
`

const SkuLabel = styled.label`
    display: inline-block;
    background-color: white;
    padding: 10px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size:15px;
    @media(max-width: 900px) {
    display: inline-block;
    background-color: white;
    padding: 6px 11px;
    border: 1px solid #ccc;
    border-radius: 4px;
    }

`

const SkuButton = styled.input`
    opacity:0;
    width: 100%;
    position: absolute;
    left: 0;
    top:0;
    height: 100%;
    cursor: pointer;

    &:checked + ${SkuLabel} {
        outline:2px solid #8719a8;
    }
`

const DivSKU = styled.div`
    margin: 5px;
    position: relative;
    
`

//#8719a8 #8955ff

export default RecomendationsShelf;