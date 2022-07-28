import React, { useState, useEffect } from 'react'
import { Layout, PageBlock, Button, InputSearch, EXPERIMENTAL_Select as Select } from 'vtex.styleguide'

interface Product {
  id: string
  isActive: boolean
  name: string
  suggestions: Option[]
}

interface Option {
  value: string
  label: string
}

function ProductCombinations() {
  const [productsData, setProductsData] = useState<Array<Product>>([])
  const [combination, setCombination] = useState<Array<string>>([])

  const fetchProducts = async() => {
    const productsIds = await fetch('/api/catalog_system/pvt/products/GetProductAndSkuIds')
    const { data } = await productsIds.json()
    const allProductsData = []

    for(const item in data){
      const resProduct = await fetch(`/api/catalog_system/pvt/products/productget/${item}`)
      const {Id, IsActive, Name} = await resProduct.json()
      const Product: Product = {
        id: Id,
        isActive: IsActive,
        name: Name,
        suggestions: []
      }
      allProductsData.push(Product)
    }
    setProductsData(allProductsData)
  }

  const productToOptions = (): Option[] => {
    const options: Option[] = []
    productsData.forEach((product) => {
      if(product.isActive){
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
    product.suggestions.forEach(item => {
      saida+= ` + ${item.label}`
    })

    setCombination([ ...combination, saida ])
    console.log(combination)
    console.log(saida)
  }

  const updateProductSuggestion = (productIndex:number, newOptions: Option[]) => {
    const productToBeUpdated = productsData[productIndex]    
    const allProducts = productsData 
    productToBeUpdated.suggestions = newOptions
    allProducts[productIndex] = productToBeUpdated
    setProductsData(allProducts)
  }

  const renderProducts = (): React.ReactElement[] => {
    const productBlocks: React.ReactElement[] = []
    productsData.forEach((product, index) => {
      if(product.isActive){
        productBlocks.push(
          <PageBlock key={product.id}>
              <Select
                label={product.name}
                options={productToOptions()}
                multi={true}
                onChange={(values: []) => updateProductSuggestion(index, values)}                
                creatable
                /> 
              <div className="flex mv3 items-center">          
              <Button size="small" variation="secondary" onClick={() => createSuggestion(product)}>
                Criar sugestão 
              </Button>
              </div>
              { 
                combination.map(item => {
                  if(item.includes(`Sugestão criada: ${product.name}`)) {
                    return(<div>{item}</div>)
                  } else {
                    return('')
                  }
                  
                })
              }            
          </PageBlock>
        )
      }
    })

    return productBlocks
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <Layout>
      <PageBlock 
        variation="full"
        title="Sugestões de produto"
        subtitle="Para cada produto, selecione as sugestões desejadas. As opções selecionadas apareceram na página do produto."
      >
        <div className="flex mv3 items-center">
          <InputSearch
            placeholder="Pesquise seu produto"    
            label=""
            size="small"    
          />
        </div>
        {renderProducts()}  
      </PageBlock>
    </Layout> 
  )
}

export default ProductCombinations