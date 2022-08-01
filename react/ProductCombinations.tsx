import React, { useState, useEffect } from 'react'
import { 
        Layout,
        PageBlock,
        Button,
        InputSearch,
        Spinner,
        ButtonPlain,
        EXPERIMENTAL_Select as Select
       } from 'vtex.styleguide'

interface Product {
  id: string
  isActive: boolean
  name: string
  suggestions: Option[]
  imagesURLs: string[]
}

interface Option {
  value: string
  label: string
}

function ProductCombinations() {
  const [productsData, setProductsData] = useState<Array<Product>>([])
  const [productsLoading, setProductsLoading] = useState<boolean>(true)
  const [searchedProductsIds, setSearchedProductsIds] = useState<string[]>([])
  const [combinations, setCombinations] = useState<Array<string>>([])

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchNotFoundMessage, setSearchNotFoundMessage] = useState<string>('')

  useEffect(() => {
    fetchProducts()
    //console.log(searchNotFoundMessage)
  }, [])

  const fetchProducts = async() => {
    const productsIds = await fetch('/api/catalog_system/pvt/products/GetProductAndSkuIds')
    const { data } = await productsIds.json()

    for(const item in data) {
      fetch(`/api/catalog_system/pvt/products/productget/${item}`)
      .then(res => {
        return res.json()
      })
      .then(json => {
        const {Id, IsActive, Name} = json
        const allImagesUrls:string[] = []
        if(IsActive){
          fetch(`/api/catalog_system/pub/products/variations/${item}`)
          .then(resVariations => {
            if(resVariations.ok) {
              return resVariations.json()
            }
            else {
              return Promise.reject(resVariations);
            }
          })
          .then(jsonVariations => {
            const { skus } = jsonVariations
            skus.forEach((item:any) => {
              allImagesUrls.push(item.image)
            })
            const product: Product = {
              id: Id,
              isActive: IsActive,
              name: Name,
              suggestions: [],
              imagesURLs: allImagesUrls
            }
            setProductsData(current => [...current, product])
            setProductsLoading(false)
          })
          .catch((error) => {
            console.log(error)
          })
        }
      })
    }
  }

  const productToOptions = (productSelect: Product): Option[] => {
    const options: Option[] = []
    productsData.forEach((product) => {
      if(product.isActive && product !== productSelect){
        const newOption: Option = {
          value: product.id,
          label: product.name
        }
        options.push(newOption)
      }
    })
    return options
  }

  const createSuggestion = (product: Product) => {    
    let saida = `Sugestão criada: ${product.name}`
    console.log(product.suggestions)
    if(product.suggestions.length > 0) {
      product.suggestions.forEach(item => {
        saida+= ` + ${item.label}`
      })
  
      setCombinations([ ...combinations, saida ])
      console.log(combinations)
      console.log(saida)
    } else {
      alert("Por favor, insira algum item como sugestão para este produto!")
    }
  }

  const updateProductSuggestion = (productIndex:number, newOptions: Option[]) => {
    const productToBeUpdated = productsData[productIndex]    
    const allProducts = productsData
    productToBeUpdated.suggestions = newOptions
    allProducts[productIndex] = productToBeUpdated
    setProductsData(allProducts)
  }

  const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lowerCase = e.target.value.toLowerCase()  
    if(lowerCase == ''){
      setSearchedProductsIds([])
    }  
    setSearchQuery(lowerCase)
  }

  const handleSearchProducts = () => {
    const matchedProducts: string[] = []
    productsData.forEach(item => {
      if(item.isActive && item.name.toLocaleLowerCase().includes(searchQuery)){
        matchedProducts.push(item.id)
      }
    })

    matchedProducts.length === 0 ? setSearchNotFoundMessage("Nenhum produto encontrado") : setSearchNotFoundMessage('')
    setSearchedProductsIds(matchedProducts)
  }

  const renderCombinations = (product: Product): React.ReactElement[] => {
    const productCombinations: React.ReactElement[] = []
    combinations.forEach(item => {
      if(item.includes(`Sugestão criada: ${product.name}`)) {
        productCombinations.push(
          <div className="flex justify-between mv5">
            {item}
            <ButtonPlain variation="danger" className="mh7">
              Excluir
            </ButtonPlain>
          </div>
        )
      }
    })

    return productCombinations
  }

  const renderProductImages = (product: Product): React.ReactElement[] => {
    const productImages: React.ReactElement[] = []
    product.imagesURLs.forEach(item => {
      productImages.push(
        <div>
          <img width="128" height="128" src={item} alt={product.name}/>
        </div>
      )
    })

    return productImages
  }

  const renderProducts = (): React.ReactElement[] => {
    const productBlocks: React.ReactElement[] = []
    productsData.forEach((product, index) => {
      if(product.isActive && (searchedProductsIds.includes(product.id) || searchedProductsIds.length === 0)) {
        productBlocks.push(
          <PageBlock key={product.id}>
            <div className="flex items-center">
              {renderProductImages(product)}
            </div>
            <div className="mv3">
              {product.name}
            </div>
            <Select
              placeholder="Selecione..."
              options={productToOptions(product)}
              multi={true}
              onChange={(values: []) => updateProductSuggestion(index, values)}                
              creatable
              />
            <div className="flex mv3 items-center">        
              <Button size="small" variation="secondary" onClick={() => createSuggestion(product)}>
                Criar sugestão
              </Button>
            </div>
            <div>
              {renderCombinations(product)}
            </div>
          </PageBlock>
        )
      }
    })

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
          placeholder="Qual produto está procurando?"
          value={searchQuery}
          onChange={handleSearchQuery}
          onSubmit={handleSearchProducts}
          errorMessage={searchNotFoundMessage}
          disabled={productsLoading}
        />
      </div>
        {
          productsLoading ? 
          <PageBlock> <Spinner /> </PageBlock>   
          :
          renderProducts()
        }
      </PageBlock>
    </Layout>
  )
}

export default ProductCombinations