import React from 'react'
import { Layout, PageBlock, EXPERIMENTAL_Select as Select } from 'vtex.styleguide'



function ProductCombinations() {
  const options = [
    {
      value: 'sugestao-A',
      label: 'Sugestão A',
    },
    {
      value: 'sugestao-B',
      label: 'Sugestão B',
    },
    {
      value: 'sugestao-C',
      label: 'Sugestão C',
    },
  ]

  function values(): any {
    console.log(`[Select] Selected: ${JSON.stringify(values, null, 2)}`)
  }

  return (
    <Layout>
      <PageBlock 
      variation="full"
      title="Sugestões de produto"
      subtitle="Para cada produto, selecione as sugestões desejadas. As opções selecionadas apareceram na página do produto."
      >
        <div>
          <Select
          label="Produto X"
          options={options}
          multi={true}
          onChange={values()}
          creatable
          />
        </div>        
      </PageBlock>
      <PageBlock>
        <div>
          <Select
          label="Produto Y"
          options={options}
          multi={true}
          onChange={values()}
          creatable
          />
        </div>
      </PageBlock>
      <PageBlock>
        <div>
          <Select
          label="Produto Z"
          options={options}
          multi={true}
          onChange={values()}
          creatable
          />
        </div>
      </PageBlock>
    </Layout>
  )
}

export default ProductCombinations