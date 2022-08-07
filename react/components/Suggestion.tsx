import React, { useState } from "react";
import { ButtonPlain, ModalDialog } from 'vtex.styleguide'

interface Props {
    productImg: string
    productName:string
    suggestionImg: string
    suggestionName: string
    deleteSuggestion(suggestionId: number): void
    suggestionId: number
}

const Suggestion = ({productImg, productName, suggestionImg, suggestionName, deleteSuggestion, suggestionId}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const handleOpen = () => {
        setIsModalOpen(true)
    }

    const handleCancelation = () => {
        setIsModalOpen(false)
    }

    const handleConfirmation = (suggestionId:number) => {
        setTimeout(() => handleCancelation(), 500)
        deleteSuggestion(suggestionId)
    }

    return (
        <div className="flex mv3 justify-center mv7">
            <div className="flex flex-column items-center mh5 w-25">
                <img className="mh5 mb3" width="80" height="80" src={productImg} />
                <span style={{textAlign:'center'}}>{productName}</span>
            </div>

            <h2 className="t-heading-2">+</h2>

            <div className="flex flex-column items-center mh5 w-25">
                <img className="mh5 mb3" width="80" height="80" src={suggestionImg} />
                <span style={{textAlign:'center'}}>{suggestionName}</span >
            </div>
            <ButtonPlain
                className="mh5"
                variation="danger"
                onClick={() => handleOpen()}
                >
                Excluir
            </ButtonPlain>

            <ModalDialog
                centered
                confirmation={{label:"Excluir", onClick: () => handleConfirmation(suggestionId), isDangerous:true}}
                cancelation={{label:"Cancelar", onClick: handleCancelation}}
                isOpen={isModalOpen}
                onClose={handleCancelation}
                >
                <div>
                    <p className="f3 f3-ns fw3 gray">
                        Tem certeza que deseja excluir essa sugestão?
                    </p>
                </div>
            </ModalDialog>
        </div>

        
    )
}

export default Suggestion