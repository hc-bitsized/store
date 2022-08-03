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
        <ItemContainer key={id} className={`${handles.shelfItem}`}>            
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
        </ItemContainer>        
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
const ItemContainer = styled.div`
    padding: 20px;
    max-width:300px;
    min-width: 300px;    
    height: auto;
   
    @media(max-width: 1280px) {
    padding: 15px;
    max-width:250px;
    min-width: 250px;    
    height: auto;
    }
    @media(max-width: 1129px) {
    padding: 5px;
    max-width:200px;
    min-width: 200px;    
    height: auto;
    }
    @media(max-width: 900px) {
    padding: 5px;
    max-width:170px;
    min-width: 170px;    
    height: auto;
    }
    @media(max-width: 768px) {
    padding: 10px;
    max-width:130px;
    min-width: 130px;    
    height: auto;
    }
    @media(max-width: 650px) {
    padding: 0px;
    max-width:300px;
    min-width: 300px;    
    height: auto;
    }
    @media(max-width: 425px) {
    padding: 0px;
    max-width:200px;
    min-width: 200px;    
    height: auto;
    }
`


export default ShelfItem;