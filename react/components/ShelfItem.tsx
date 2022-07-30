import React from 'react';
import { useCssHandles } from "vtex.css-handles"


import  { formatPrice } from '../helpers/Helper'

const CSS_HANDLES = [
    'container',
    'shelfTitle',
    'shelfItem',
    'shelfLink',
    'shelfInfo',
    'ShelfImage',
    'shelfImage__img',
    'hover',
    'hoverText',
    'shelfProductName',
    'shelfPrice',
    'shelfSellingPrice',
    'shelfBestPrice',
    'shelfContent'
]

const ShelfItem = ({id, linkURL, imageURL, name, price, sellingPrice}: shelfType) => {
    const handles = useCssHandles(CSS_HANDLES)
    return(
        <div key={id} className={`${handles.shelfItem}`}>
            <a href={`${linkURL}`} className={`${handles.shelfLink}`}> 
                <div className={`${handles.shelfImage}`}>
                    <img src={`${imageURL}`} alt={`${name}`} className={`${handles.shelfImage__img}`} />
                </div>
                <h2 className={`${handles.shelfProductName}`}>{`${name}`}</h2>
                <div className={`${handles.shelfPrice}`}>
                    <p className={`${handles.shelfSellingPrice}`}> 
                        {formatPrice(sellingPrice)}
                    </p>
                    <p className={`${handles.shelfBestPrice}`}>
                        {formatPrice(price)}
                    </p>
                </div> 
            </a>
            <a>
                <div>
                    <h1>+</h1>
                </div>
            </a>
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

export default ShelfItem;