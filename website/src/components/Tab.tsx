import React, { useState } from "react"
import styled from "styled-components"
import { useDebouncedCallback } from "use-debounce/lib"

const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  margin-bottom: 24px;
`

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  color: #353535;
  margin-right: 16px;
`

const SearchInput = styled.input`
  flex: 1;
  justify-self: end;
  align-self: center;
  width: 350px;
  border: none;
  border-radius: 4px;
  padding: 16px 18px;
  color: #353535;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`

interface Props {
  title: string
  onSearchValueChange: (value: string) => void
  children: React.ReactElement
}

export default function Tab(props: Props) {
  const [searchValue, setSearchValue] = useState("")

  const [searchCallback] = useDebouncedCallback(
    () => props.onSearchValueChange(searchValue),
    500
  )

  return (
    <>
      <Header>
        <Title>{props.title}</Title>

        <SearchInput
          type="text"
          placeholder="Search by name"
          onChange={event => {
            setSearchValue(event.target.value)
            searchCallback()
          }}
          value={searchValue}
        />
      </Header>
      {props.children}
    </>
  )
}
