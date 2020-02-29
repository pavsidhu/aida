import React, { useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
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

const Search = styled.div`
  position: relative;
  flex: 1;
  justify-self: end;
  align-self: center;
  width: 350px;
`

const Input = styled.input`
  width: 100%;
  border: none;
  border-radius: 4px;
  padding: 16px 18px;
  color: #353535;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`

const SearchIcon = styled(FontAwesomeIcon)`
  color: #d0d0d0;
  position: absolute;
  right: 18px;
  height: 100%;

  &:hover {
    cursor: pointer;
  }
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

        <Search>
          <Input
            type="text"
            placeholder="Search by name"
            onChange={event => {
              setSearchValue(event.target.value)
              searchCallback()
            }}
            value={searchValue}
          />
          <SearchIcon
            icon={faSearch}
            onClick={() => props.onSearchValueChange(searchValue)}
          />
        </Search>
      </Header>
      {props.children}
    </>
  )
}
