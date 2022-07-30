import React, { useState, useEffect} from 'react';
import { useCssHandles } from "vtex.css-handles";
import { SliderLayout } from 'vtex.slider-layout';


import ShelfItem from './components/ShelfItem'

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
            setArrayProducts(data)
        })
        
                 
    }

    console.log('type of arrayProducts: ', typeof(arrayProducts))

    console.log('arrayProducts', arrayProducts)

    return(
        <div className={`${handles.containerShelf}`}>
            {arrayProducts ? 
                <SliderLayout 
                itemsPerPage={{
                    desktop:3,
                    tablet:3,
                    phone:3,
                }}
                ShowPaginationDots='never'
                >
                    {arrayProducts.map((product: any) => (
                        <ShelfItem 
                            linkURL={product.link} 
                            id={product.id}
                            imageURL={product.items[0].images[0].imageUrl} 
                            name={product.productName} 
                            sellingPrice={product.items[0].sellers[0].commertialOffer.ListPrice}
                            price={product.items[0].sellers[0].commertialOffer.Price} 
                        />                       
                        
                    ))} 
                </SliderLayout> 
                
            : ''}
        </div>
    )
}

export default RecomendationsShelf;