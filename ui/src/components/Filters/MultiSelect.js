/** @jsx jsx */
import { Fragment, useState } from 'react'
import { jsx, Box } from 'theme-ui'
import { Grid } from '@theme-ui/components'

import categories from '../../data/categories.json'

import Button from '../Button'
import Row from './Row'

const Filters = ({ title, setValue }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState([])
  const [searchText, setSearchText] = useState('')

  const allCategories = () => {
    let allCats = categories.reduce((acc, current) => {
      acc.push({ ...current, image: `/categories/${current.slug}.png` })
      if (current.subcategories) {
        const cat = current.subcategories.map(subcat => ({
          ...subcat,
          parent: current,
          image: `/categories/${subcat.slug}.png`,
        }))
        acc.push(cat)
      }
      return acc.flat()
    }, [])

    if (searchText) {
      allCats = allCats.filter(
        allCat =>
          allCat.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1,
      )
    }
    return allCats
  }

  return (
    <Box>
      <Fragment>
        <Grid
          sx={{
            gridTemplateColumns: 'max-content 1fr',
            alignItems: 'center',
            cursor: 'pointer',
            borderBottom: '1px solid rgba(255,255,255,0.32)',
            pb: 2,
          }}
          gap={1}
          onClick={() => {
            setIsOpen(!isOpen)
            setSearchText('')
          }}
        >
          <p
            sx={{
              color: 'white',
              opacity: 0.64,
              variant: 'text.large',
            }}
          >
            {selected.length > 0 ? (
              <span>Pick more categories</span>
            ) : (
              <span>Pick categories</span>
            )}
          </p>
          <Box
            sx={{
              justifySelf: 'end',
              height: '9px',
              width: '9px',
              borderTop: '2px solid',
              borderRight: '2px solid',
              borderColor: 'white',
              transform: isOpen ? 'rotate(-45deg)' : 'rotate(135deg)',
            }}
          />
        </Grid>
        {isOpen && (
          <Box
            sx={{
              maxWidth: '560px',
              marginLeft: -5,
              position: 'absolute',
              background: 'white',
              width: '100%',
              height: '512px',
              overflowY: 'scroll',
              zIndex: 5,
              marginTop: '-96px',
            }}
          >
            <Box>
              <p
                sx={{
                  variant: 'text.field',
                  color: 'blackFaded',
                  pt: 5,
                  pl: 5,
                }}
              >
                {title}
              </p>
              <Grid
                sx={{
                  gridTemplateColumns: '1fr max-content',
                  alignItems: 'center',
                  px: 5,
                  pt: 4,
                  position: 'relative',
                }}
              >
                <input
                  sx={{
                    color: 'rgba(9,6,16,0.64) !important',
                    borderBottom: '1px solid rgba(9,6,16,0.34)',
                    '&::placeholder': {
                      color: 'rgba(9,6,16,0.34) !important',
                      fontSize: '18px !important',
                    },
                  }}
                  autoFocus="autofocus"
                  placeholder="Search category"
                  onChange={e => {
                    setSearchText(
                      e.target.value ? e.target.value.toLowerCase() : '',
                    )
                  }}
                  value={searchText}
                />
                <Button
                  onClick={e => {
                    e.preventDefault()
                    setIsOpen(false)
                    setSearchText('')
                    setValue(selected)
                  }}
                  text={`Select (${selected.length})`}
                  variant="primary"
                  sx={{
                    m: 0,
                    px: 4,
                    right: '24px',
                    fontSize: '1rem',
                    position: 'absolute',
                    boxSizing: 'border-box',
                    opacity: selected && selected.length > 0 ? 1 : 0.64,
                  }}
                />
              </Grid>
            </Box>

            <Box sx={{ position: 'relative' }}>
              {allCategories().map((category, index) => (
                <Row
                  key={`${category.name}${index}`}
                  item={category}
                  parent={category.parent}
                  selected={selected}
                  setSelected={setSelected}
                  multiselect={true}
                />
              ))}
            </Box>
          </Box>
        )}
        {selected.map(item => (
          <Row
            key={item.name}
            item={item}
            parent={item.parent}
            selected={selected}
            setSelected={setSelected}
            sx={{ background: 'white', mx: 0, my: 3 }}
            close={true}
            multiselect={true}
          />
        ))}
      </Fragment>
    </Box>
  )
}

export default Filters