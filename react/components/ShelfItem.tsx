import React from 'react';
import styled from 'styled-components'


import  { formatPrice } from '../helpers/Helper'

const ShelfItem = ({id, linkURL, imageURL, name, price}: shelfType) => {    
    return(
        <ItemContainer key={id} >            
            <ProductLink href={`${linkURL}`} > 
                <div >
                    <Img src={`${imageURL}`} alt={`${name}`} />
                </div>
                <ProductName>{`${name}`}</ProductName>
                <div>
                    {/* <p> 
                        {formatPrice(sellingPrice)}
                    </p> */}
                    <ProductPrice>
                        {formatPrice(price)}
                    </ProductPrice>
                </div> 
                
            </ProductLink>            
        </ItemContainer>        
    )   


    
}

// ------------------------------------- CSS styles
const Img = styled.img`
    max-height: 350px;
    min-height: 350px;
    width: auto;
`
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
    /* max-width:300px;
    min-width: 300px;    
    height: auto; */
   
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
    padding: 10px;
    max-width:170px;
    min-width: 170px;    
    height: auto;
    }
    @media(max-width: 768px) {
    /* padding: 0px;
    max-width:300px;
    min-width: 300px;    
    height: auto; */
    }
    @media(max-width: 425px) {
    padding: 0px;
    max-width:150px;
    min-width: 150px;    
    height: auto;
    }
`


export default ShelfItem;