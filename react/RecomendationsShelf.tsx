import React, { useState, useEffect} from 'react';
import { useCssHandles } from "vtex.css-handles";
import styled from 'styled-components';
import { useOrderItems } from 'vtex.order-items/OrderItems';
import { useProduct } from 'vtex.product-context'


import ShelfItem from './components/ShelfItem'
import  { formatPrice } from './helpers/Helper'

const CSS_HANDLES = ["containerShelf", "buttonText"]

const RecomendationsShelf = () => {
    const productContext = useProduct();
    const { addItems } = useOrderItems();
    const [ loading, setLoading ] = useState<boolean>(false);
    const handles = useCssHandles(CSS_HANDLES)
    const [ arrayProducts, setArrayProducts]  = useState([]) as any       
    
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
        for(let i = 0; i < productsIds.slice(0,3).length; i++) {           

            await fetch(`/api/catalog_system/pub/products/search?fq=productId:${productsIds[i]}`)
            .then((response) => response.json()) 
            .then((data) => {
                productsList.push(data[0])                
            }) 
        }

        console.log('LISTA:' ,productsList)
        setArrayProducts(productsList)
        setLoading(true)
                 
    }
    console.log('type of arrayProducts: ', typeof(arrayProducts))
    console.log('arrayProducts', arrayProducts.length)
    console.log('productContext', productContext)    
    
    
    let priceSum = 0;
    
    arrayProducts.map((product: any) => {
        priceSum += product.items[0].sellers[0].commertialOffer.Price 
    })

    // funcao que adiciona todos os produtos da combinacao no carrinho
    const addToCart = async () => {
        
        await arrayProducts.map((product: any) => {
            fetch(`/api/catalog_system/pub/products/search?fq=productId:${product.productId}`)
            .then((response) => response.json()) 
            .then((data) => {
                populateCart(data)
            }) 
        })     
    }
    
    // Adicionando informações sobre cada produto que está sendo add no carrinho
    const populateCart = (data: any) => {
        
        const cart = [
            {
                additionalInfo: {
                    brandName: data[0].brand,
                    __typename: 'ItemAdditionalInfo',
                },
                availability: data[0].items[0].sellers[0].commertialOffer.IsAvailable,
                id: data[0].items[0].itemId,
                imageUrls: {
                    at1x: data[0].items[0].images[0].imageUrl,
                    __typename: 'ImageUrls',
                },
                listPrice: data[0].items[0].sellers[0].commertialOffer.ListPrice,
                measurementUnit: data[0].items[0].measurementUnit,
                name: data[0].productName,
                price: data[0].items[0].sellers[0].commertialOffer.Price,
                productId: data[0].productId,
                quantity: 1,
                seller: data[0].items[0].sellers[0].sellerId,
                skuName: data[0].items[0].nameComplete,
                uniMultiplier: data[0].items[0].unitMultiplier,
                uniqueId: data[0].items[0].itemId,
                isGift: false,
                __typename: 'Item',
            }
        ]

        addItems(cart)
    }

    useEffect(() => {
        getItems() 
    }, [])

    // Renderiza na pdp
    if(arrayProducts.length <= 1) {

        return (
            <>
                {loading ? 
                    <div>
                        <Loading>Desculpe, ainda não temos sujestões para este produto</Loading>
                        <Loading>Você pode ser o primeiro a comprar algo junto com ele haha</Loading>
                    </div>

                : 
                    <Loading> Carregando sugestões... </Loading>}
            </>
        )
    } else {        
        return (
            <Container className={`${handles.containerShelf}`}>
                <Title>
                    <h1>Compre Junto</h1>
                </Title>
                {arrayProducts && loading ? 
                    <ItemContainer> 
                        {arrayProducts.map((product: any, index: any) => (                         
                            <div>
                                {index === 0 ? 
                                    <PlusImage> 
                                        <ShelfItem 
                                            linkURL={product.link} 
                                            id={product.productId}
                                            imageURL={product.items[0].images[0].imageUrl} 
                                            name={product.productName} 
                                            sellingPrice={product.items[0].sellers[0].commertialOffer.ListPrice}
                                            price={product.items[0].sellers[0].commertialOffer.Price}  
                                        /> 
                                    </PlusImage>                            
                                    : index === (arrayProducts.length - 1) ?
                                    <PlusImage>
                                        <div><BigText>+</BigText></div>
                                        <ShelfItem 
                                            linkURL={product.link} 
                                            id={product.productId}
                                            imageURL={product.items[0].images[0].imageUrl} 
                                            name={product.productName} 
                                            sellingPrice={product.items[0].sellers[0].commertialOffer.ListPrice}
                                            price={product.items[0].sellers[0].commertialOffer.Price}  
                                        /> 
                                        <div><BigText>=</BigText></div>
                                        <TotalPrice>
                                            <BigText>Leve os 3 itens</BigText>
                                            <SmallText>E economize</SmallText>
                                            <BigText>{formatPrice(priceSum)}</BigText>
                                            <CartButton id={product.productId} onClick={addToCart} className='button' >
                                                ADICIONAR TUDO AO CARRINHO
                                            </CartButton>
                                        </TotalPrice>
                                    </PlusImage> 
                                : 
                                    <PlusImage>
                                        <div><BigText>+</BigText></div>
                                        <ShelfItem 
                                            linkURL={product.link} 
                                            id={product.productId}
                                            imageURL={product.items[0].images[0].imageUrl} 
                                            name={product.productName} 
                                            sellingPrice={product.items[0].sellers[0].commertialOffer.ListPrice}
                                            price={product.items[0].sellers[0].commertialOffer.Price}  
                                        /> 
                                        
                                    </PlusImage>
                                }
                            
                            </div>                      
                            
                        ))}
                    </ItemContainer> 
                    
                : <Loading>Carregando sugestões...</Loading>}
            </Container>  
        )
    }
}

// ------------------------------------ CSS styled components
const Loading = styled.h3`
    text-align: center;
    font-family: San Francisco,-apple-system,BlinkMacSystemFont,avenir next,avenir,ubuntu,roboto,noto,segoe ui;
`

const Title = styled.div`
    text-align: center;
    color: #3f3f40;
`

const BigText = styled.h1`
    color: #3f3f40;
`
const SmallText = styled.p`
    color: #3f3f40;
`

const Container = styled.div` 
    max-width: 1280px;    
    margin: 0 auto;  
`
const ItemContainer = styled.div`
    display: flex;
    align-items: center;
`
const PlusImage = styled.div`
    display: flex;
    align-items: center;
    
`
const TotalPrice = styled.div`
    padding: 50px;
    size: 400px;
    text-align: center;
`
const CartButton = styled.div`
    display: inline-block;
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

    &:hover.button {
        background-color: #8955ff
    } 
`

//#8719a8 #8955ff

export default RecomendationsShelf;