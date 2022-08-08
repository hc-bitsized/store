import React from 'react';
import styled from 'styled-components'


import  { formatPrice } from '../helpers/Helper'

const ShelfItem = ({id, linkURL, imageURL, name, price, noDiscount}: shelfType) => {    
    return(
        <ItemContainer key={id} >            
            <ProductLink href={`${linkURL}`} > 
                <div >
                    <Img src={`${imageURL}`} alt={`${name}`} />
                </div>
                <ProductName>{`${name}`}</ProductName>
                <Price>
                    {noDiscount > price ? 
                        <Discount> 
                            {formatPrice(noDiscount)}
                        </Discount> 
                        :
                        <div></div>}
                    <ProductPrice>
                        {formatPrice(price)}
                    </ProductPrice>
                </Price> 
                
            </ProductLink>            
        </ItemContainer>        
    )   


    
}

// ------------------------------------- CSS styles
const Price = styled.div`
    min-height: 50px;
    max-height: 50px;
    max-width: 350px
`
const Discount = styled.p`
    text-decoration: line-through;
    color: #727273;
    font-size: smaller;
`
const Img = styled.img`
    max-height: 350px;
    min-height: 350px;
    width: auto;
    @media(max-width: 1024px) {
    max-height: 300px;
    min-height: 300px;
    width: auto;
    }
    @media(max-width: 768px) {
    max-height: 250px;
    min-height: 250px;
    width: auto;
    }
    @media(max-width: 425px) {
    max-height: 150px;
    min-height: 150px;
    width: auto;
    }

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
`


export default ShelfItem;