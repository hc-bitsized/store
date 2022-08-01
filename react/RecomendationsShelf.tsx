import React, { useState, useEffect} from 'react';
import { useCssHandles } from "vtex.css-handles";
// import { SliderLayout } from 'vtex.slider-layout';
import styled from 'styled-components'


import ShelfItem from './components/ShelfItem'
import  { formatPrice } from './helpers/Helper'

const CSS_HANDLES = ["containerShelf"]

const RecomendationsShelf = () => {
    const handles = useCssHandles(CSS_HANDLES)
    const [arrayProducts, setArrayProducts] = useState([]) as any

    useEffect(() => {
        getItems() 
    }, [])

    const getItems = () => {
        fetch('/api/catalog_system/pub/products/search/camisa')
        .then((response) => response.json()) 
        .then((data) => {
            setArrayProducts(data.slice(0,3))
        })
                 
    }

    console.log('type of arrayProducts: ', typeof(arrayProducts))

    console.log('arrayProducts', arrayProducts)
    
    let priceSum = 0;

    arrayProducts.map((product: any) => {
        priceSum += product.items[0].sellers[0].commertialOffer.Price
    })

    return(
        <Container className={`${handles.containerShelf}`}>
            {arrayProducts ? 
                
                <ProductsContainer>  
                    {arrayProducts.map((product: any, index: any) => (                         
                        <PlusImage>
                            {index === 0 ? 
                                <ShelfItem 
                                linkURL={product.link} 
                                id={product.id}
                                imageURL={product.items[0].images[0].imageUrl} 
                                name={product.productName} 
                                sellingPrice={product.items[0].sellers[0].commertialOffer.ListPrice}
                                price={product.items[0].sellers[0].commertialOffer.Price}  
                                /> 
                            
                                : index === (arrayProducts.length - 1) ?
                                    <PlusImage>
                                        <div><h1>+</h1></div>
                                        <ShelfItem 
                                        linkURL={product.link} 
                                        id={product.id}
                                        imageURL={product.items[0].images[0].imageUrl} 
                                        name={product.productName} 
                                        sellingPrice={product.items[0].sellers[0].commertialOffer.ListPrice}
                                        price={product.items[0].sellers[0].commertialOffer.Price}  
                                        /> 
                                        <div><h1>=</h1></div>
                                        <TotalPrice><h1>{formatPrice(priceSum)}</h1></TotalPrice>
                                    </PlusImage> 
                                : 
                                    <PlusImage>
                                        <div><h1>+</h1></div>
                                        <ShelfItem 
                                        linkURL={product.link} 
                                        id={product.id}
                                        imageURL={product.items[0].images[0].imageUrl} 
                                        name={product.productName} 
                                        sellingPrice={product.items[0].sellers[0].commertialOffer.ListPrice}
                                        price={product.items[0].sellers[0].commertialOffer.Price}  
                                        /> 
                                        
                                    </PlusImage>
                            }
                        
                        </PlusImage>                      
                        
                    ))} 
                </ProductsContainer> 
                
            : ''}
        </Container>
        
    )
}

// CSS styles
const Container = styled.div`    
    max-width: 1280px;    
    margin: 0 auto;
`

const ProductsContainer = styled.div`
    display: flex;
    align-items: center;
`
const PlusImage = styled.div`
    display: flex;
    align-items: center;
`
const TotalPrice = styled.div`
    padding: 50px;
`

export default RecomendationsShelf;