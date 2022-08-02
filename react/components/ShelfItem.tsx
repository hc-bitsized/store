import React from 'react';
import { useCssHandles } from "vtex.css-handles";
import styled from 'styled-components'


import  { formatPrice } from '../helpers/Helper'

const CSS_HANDLES = [
    'shelfItem',
    'shelfLink',
    'ShelfImage',
    'shelfImage__img',
    'shelfProductName',
    'shelfPrice',
    'shelfSellingPrice',
    'shelfBestPrice',
]

const ShelfItem = ({id, linkURL, imageURL, name, price}: shelfType) => {
    const handles = useCssHandles(CSS_HANDLES)
    return(
        <div key={id} className={`${handles.shelfItem}`}>            
            <ProductLink href={`${linkURL}`} className={`${handles.shelfLink}`}> 
                <div className={`${handles.shelfImage}`}>
                    <img src={`${imageURL}`} alt={`${name}`} className={`${handles.shelfImage__img}`} />
                </div>
                <ProductName className={`${handles.shelfProductName}`}>{`${name}`}</ProductName>
                <div className={`${handles.shelfPrice}`}>
                    {/* <p className={`${handles.shelfSellingPrice}`}> 
                        {formatPrice(sellingPrice)}
                    </p> */}
                    <ProductPrice className={`${handles.shelfBestPrice}`}>
                        {formatPrice(price)}
                    </ProductPrice>
                </div> 
            </ProductLink>            
        </div>        
    )   


    // return(
    //     <div key={id}>
    //         <a href={`${linkURL}`} > 
    //             <div >
    //                 <img src={`${imageURL}`} alt={`${name}`}  />
    //             </div>
    //             <h2 >{`${name}`}</h2>
    //             <div>
    //                 <p>
    //                     {formatPrice(sellingPrice)}
    //                 </p>
    //                 <p>
    //                     {formatPrice(price)}
    //                 </p>
    //             </div> 
    //         </a>
    //     </div>
    // )
}

// CSS styles
const ProductName = styled.h4`    
    color: black;
`

const ProductLink = styled.a`
    text-decoration: none;
`
const ProductPrice = styled.p`
    color: black;
`


export default ShelfItem;