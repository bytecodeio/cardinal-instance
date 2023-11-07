import React, { useEffect, useState } from "react"
export const SearchInput = ({fields, filters}) => {
    const [allOptions, setAllOptions] = useState([])
    const [searchOptions, setSearchOptions] = useState([])
    const [selection, setSelection] = useState([])
    const [selectOpen, setSelectOpen] = useState(false)

    useEffect(() => {
        console.log("search fields", fields);
        let _results = []
        if (fields?.fields.length> 0) {
            fields.fields.map((f) => {
                _results.push(f['label_short'])
            })
        }
        if (filters.length > 0) {
            filters.map(filter => {
                filter.fields.map(f => {
                    _results.push(f['label_short'])
                })
            })
        }
        setAllOptions(sortData(_results));
        setSearchOptions(sortData(_results));
        console.log("search filters", filters);
    },[])

    const sortData = (data) => {
    return data.sort((a,b) => {
        var x = a.toLowerCase();
        var y = b.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
    }


    const handleSelectionChange = (v) => {
        setSelection(v.target.value)
        filterSearchOptions(v.target.value)
    }

    const openSearchOptions = () => {
        setSelectOpen(true)
    }

    const closeSearchOptions = () => {
        setSelectOpen(false)
    }

    const filterSearchOptions = (value) => {
        let _allOptions = [...allOptions]
        let _newList = _allOptions.filter(option => {
            return option.includes(value);
        })
        setSearchOptions(_newList)
    }
    return(
        <>
        <div onFocus={openSearchOptions} onBlur={closeSearchOptions} >
            <div className="position-relative columnStart mb-3">
                <label>Search Selections</label>
                <input value={selection} onChange={handleSelectionChange} placeholder="" type="search" class="form-control" />
                <i class="far fa-search absoluteSearch"></i>
            </div>
            {selectOpen?
            <div className="search-popover">       
                {searchOptions?.map(opt => (
                    <option>{opt}</option>
                ))}
            </div>
                :''
            }                
        </div>
        </>
    )
}