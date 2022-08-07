import React, { useState, useEffect, useRef } from 'react'
import { 
        Layout,
        PageBlock,
        Button,
        InputSearch,
        Spinner,
        EXPERIMENTAL_Select as Select
       } from 'vtex.styleguide'
import Suggestion from './components/Suggestion'

interface SuggestionData {
  suggestionId: number
  suggestedId: number
}

interface PreSuggestionData {
  preSuggestionId:number
  countOrders:number
}
interface Product {
  id: number
  isActive: boolean
  name: string
  suggestion: Product | null
  preSuggestions: PreSuggestionData[]
  savedSuggestions: SuggestionData[]
  imageURL: string
}

function ProductCombinations() {
  const [productsData, setProductsData] = useState<Array<Product>>([])
  const [productsLoading, setProductsLoading] = useState<boolean>(true)
  const [searchedProductsIds, setSearchedProductsIds] = useState<number[]>([])

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchNotFoundMessage, setSearchNotFoundMessage] = useState<string>('')
  const [maxProducts, setMaxProducts] = useState<number>(5)

  const searchInputRef = useRef()

  const API = 'https://bitsized.socialfitness.com.br/api'

  useEffect(() => {
    fetchProducts()
    //console.log(searchNotFoundMessage)
  }, [])

  const fetchProducts = async() => {
    const productsIds = await fetch('/api/catalog_system/pvt/products/GetProductAndSkuIds?_to=50')
    const { data } = await productsIds.json()
    const requests:any = []
    Object.keys(data).forEach((product:any) => {
      requests.push(fetch(`/api/catalog_system/pub/products/search?fq=productId:${product}`))
    })
    Promise.all(requests)
    .then((res:any) => {
      Promise.all(res.map((r:any) => r.json()))
      .then(json => {
        json.forEach((prod:any) => {
            if(prod.length > 0) {
            const {productId, productName} = prod[0]
            const isActive = true
            const allPreSuggestions:PreSuggestionData[] = []
            const allSuggestions:SuggestionData[] = []
            if(isActive){
              fetch(`${API}/pre-suggestion?productId=${productId}`)
              .then(resPreSuggestions => {
                return resPreSuggestions.json()
              })
              .then(jsonPreSuggestions => {
                const { preSuggestions } = jsonPreSuggestions.data
                preSuggestions.forEach((item:any) => {
                  const preSuggestion: PreSuggestionData = {
                    preSuggestionId:item.productId,
                    countOrders:item.countOrders
                  }
                  allPreSuggestions.push(preSuggestion)
                })
              })

              fetch(`${API}/suggestion?productId=${productId}`)
              .then(resSuggestions => {
                return resSuggestions.json()
              })
              .then(jsonSuggestion => {
                const { data } = jsonSuggestion
                data.forEach((item:any) => {    
                  if(item.deleted == false){
                    const suggestion: SuggestionData = {
                      suggestionId: item.suggestionId,
                      suggestedId: item.suggestedId
                    }
                    allSuggestions.push(suggestion)
                  }
                })
                const product: Product = {
                  id: productId,
                  isActive: isActive,
                  name: productName,
                  suggestion: null,
                  preSuggestions: allPreSuggestions,
                  savedSuggestions: allSuggestions,
                  imageURL: prod[0].items[0].images[0].imageUrl
                }
                setProductsData(current => [...current, product])
                setProductsLoading(false)
              })
            }
          }
        })
      })
    })
  }

  const getProductById = (id:number):Product => {
    const foundProd = productsData.find(prod => prod.id == id)
    return foundProd!
  }

  const productToOptions = (productSelect: Product):any => {
    const others:any[] = []
    const preSuggestions:any[] = []
    const preSuggestedProducts: Product[] = []
    productSelect.preSuggestions = productSelect.preSuggestions.sort((a, b) => a.countOrders >= b.countOrders ? -1 : 1)
    productSelect.preSuggestions.forEach(item => {
      const product = getProductById(item.preSuggestionId)
      if(product){
        const newOption = {
          value: product,
          label: `${product.name} (comprado junto ${item.countOrders} ${item.countOrders> 1 ? "vezes" : "vez"})`
        }
        preSuggestions.push(newOption)
        preSuggestedProducts.push(product)
      }
    })
    productsData.forEach((product) => {
      if(product.isActive && product !== productSelect && !preSuggestedProducts.includes(product)){
        const newOption = {
          value: product,
          label: product.name
        }
        others.push(newOption)
      }
    })

    if(preSuggestedProducts.length > 0)
      return [
        {
          label:"Frequentemente comprados juntos",
          options: preSuggestions
        },
        {
          label:"Outros produtos",
          options: others
        }
      ]
    
    return others
  }

  const createSuggestion = (productIndex:number) => {    
    const productToBeUpdated = productsData[productIndex]    
    const allProducts = [...productsData]
    if(productToBeUpdated.suggestion !== null){
      fetch(`${API}/suggestion`, {
        method:"POST",
        headers: {"Content-type": "application/json;charset=UTF-8"},
        body: JSON.stringify({productId:productToBeUpdated.id, suggestedId:productToBeUpdated.suggestion.id})
      })
      .then(res => {
        return res.json()
        .then((json:any) => {
          if(json.error){
            alert(json.error.msg)
          } else {
            const newSuggestion: SuggestionData = {
              suggestionId: json.data.suggestionId,
              suggestedId: json.data.suggestedId
            } 
            productToBeUpdated.savedSuggestions.push(newSuggestion)
            allProducts[productIndex] = productToBeUpdated
            setProductsData(allProducts)
          }
        })
      })
    } else {
      alert("Por favor, insira algum item como sugestão para este produto!")
    }
  }

  const deleteSuggestion = (suggestionId:number) => {
    let prodFoundId:number
    let suggestionFoundId:number = 0
    productsData.forEach(prod => {
      prod.savedSuggestions.forEach(suggestion => {
        if(suggestion.suggestionId == suggestionId){
          suggestionFoundId = suggestionId
          prodFoundId = prod.id
        }
      })
    })
    if(suggestionFoundId){
      fetch(`${API}/suggestion/${suggestionFoundId}`, {
        method:"DELETE",
      })
      .then(res => {
        if(res.status == 204) {
          const allProducts = [...productsData]
          const prod = getProductById(prodFoundId)
          const prodIndex = productsData.indexOf(prod)
          console.log(allProducts, prodIndex)
          prod.savedSuggestions = prod.savedSuggestions.filter(suggestion => suggestion.suggestionId !== suggestionFoundId)
          allProducts[prodIndex] = prod
          console.log(prodIndex)
          // console.log(allProducts.length)
          setProductsData(allProducts)
        } else {
          alert("Erro ao deletar sugestão")
        }
      })
    }
  }

  const updateProductSuggestion = (productIndex:number, newOption: Product) => {
    const productToBeUpdated = productsData[productIndex]    
    const allProducts = [...productsData]
    productToBeUpdated.suggestion = newOption
    allProducts[productIndex] = productToBeUpdated
    setProductsData(allProducts)
  }

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value == ''){
      setSearchedProductsIds([])
      setMaxProducts(5)
    }  
    setSearchQuery(e.target.value)
  }

  const handleSearchProducts = () => {
    const matchedProducts: number[] = []
    productsData.forEach(item => {
      if(item.isActive && item.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())){
        matchedProducts.push(item.id)
      }
    })

    matchedProducts.length === 0 ? setSearchNotFoundMessage("Nenhum produto encontrado") : setSearchNotFoundMessage('')
    setMaxProducts(5)
    setSearchedProductsIds(matchedProducts)
  }

  const renderSuggestions = (product: Product): React.ReactElement[] => {
    const suggestions: React.ReactElement[] = []
    product.savedSuggestions.forEach((item) => {
      const itemExist = getProductById(item.suggestedId)
      if(itemExist){
        suggestions.push(
          <Suggestion
            productImg={product.imageURL}
            productName={product.name}
            suggestionImg={getProductById(item.suggestedId).imageURL}
            suggestionName={getProductById(item.suggestedId).name}
            deleteSuggestion={deleteSuggestion}
            suggestionId={item.suggestionId}
            />
        )
      }
    })

    return suggestions
  }

  const renderProductImages = (product: Product): React.ReactElement => {
    return (
        <div className="mb5 flex flex-wrap">
          <img className="mh5" width="128" height="128" src={product.imageURL} alt={product.name}/>
        </div>
      )
  }

  const renderProducts = (): React.ReactElement[] => {
    let count = 0
    const productBlocks: React.ReactElement[] = []
    // productsData.forEach((product, index) => {
    for(const [index, product] of productsData.entries()){
      if(product.isActive && count < maxProducts && (searchedProductsIds.includes(product.id) || searchedProductsIds.length === 0)) {
        console.log(searchedProductsIds.length)
        count+=1
        productBlocks.push(
          <PageBlock key={product.id}>
            <div className="flex flex-column items-center justify-center">
              <div className="mh3">
                {renderProductImages(product)}
              </div>
              <div className="mb5">
              {product.name}
              </div>
            </div>
            <Select
              placeholder="Selecione..."
              options={productToOptions(product)}
              multi={false}
              onChange={(values:any) => updateProductSuggestion(index, values.value)}                
              creatable
              />
            <div className="flex mt5 flex-column justify-center items-center" onClick={() => createSuggestion(index)}>        
              <Button 
                size="small"
                variation="secondary"
                >
                Criar sugestão
              </Button>
            </div>
            <div>
              {renderSuggestions(product)}
            </div>
          </PageBlock>
        )
      }
    }

    return productBlocks
  }

  return (
    <Layout>
      <PageBlock 
        variation="full"
        title="Sugestões de produto"
        subtitle="Para cada produto, selecione as sugestões desejadas. As opções selecionadas apareceram na página do produto."
      >
      <div className="flex mv3 items-center">
        <InputSearch
          ref={searchInputRef}
          placeholder="Qual produto está procurando?"
          value={searchQuery}
          onChange={handleSearchQuery}
          onSubmit={handleSearchProducts}
          errorMessage={searchNotFoundMessage}
          disabled={productsLoading}
        />
      </div>
      <div className="flex justify-center items-center">
              <h3>{`${searchedProductsIds.length > 0 ? searchedProductsIds.length : productsData.length} produto(s) encontrado(s)` }</h3>
      </div>
        {
          productsLoading ? 
          <PageBlock> <Spinner /> </PageBlock>   
          :
          renderProducts()
        }
        <div className="flex mt5 justify-center items-center">
          <Button 
            size="small"
            variation="secondary"
            onClick={() => setMaxProducts(current => current+5)}
            disabled={searchedProductsIds.length > 0 ? maxProducts >= searchedProductsIds.length : maxProducts >= productsData.length}
            >
            Carregar mais
          </Button>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default ProductCombinations