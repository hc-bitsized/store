import React from 'react'
import { Layout, PageBlock, EXPERIMENTAL_Select as Select } from 'vtex.styleguide'

function WeeklySuggestions() {
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
      title="Promoções semanais"
      subtitle="Aqui você tem a opção de definir, semanalmente, promoções para combinações de produtos."
      >
        <div>
          <Select
          label="Promoção X"
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
          label="Promoção Y"
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
          label="Promoção Z"
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

export default WeeklySuggestions