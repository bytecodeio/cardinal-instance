import React, { useEffect, useRef } from "react"
import { useState } from "react";
import { Button, Form, Overlay, OverlayTrigger, Popover, Tooltip } from "react-bootstrap"

export const SavedFilters = ({savedFilters, handleVisUpdate, setSelectedFilters, removeSavedFilter, upsertSavedFilter}) => {

    const target = useRef(null);
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

    useEffect(() => {
        console.log("saved filters", savedFilters)
    },[savedFilters])

    const handleSavedFilterClick = async (filter) => {
        setSelectedFilters(filter['filter_string'])
        handleVisUpdate({}, filter['filter_string'])
    }

    const handleSavedFilterRemoval = (id) => {
        console.log("remove saved filter", id)
        removeSavedFilter(id)
    }

    const handleNewSavedFilterPopover = () => {
        console.log("open", target)
        setOpen(!open)
    }
    const handleUpdateSavedFilter = () => {
        console.log("open", target)
        setOpenEdit(!openEdit)
    }

    return (
        <>
        <div style={{paddingBottom:'30px'}}><span className="allOptions saved-filter-button" ref={target} onClick={handleNewSavedFilterPopover} ><i class="fal fa-plus"></i>   Add</span></div>
        <Overlay target={target.current} show={open} placement="right">
            <div>
                <NewSavedFilterPanel setOpen={setOpen} upsertSavedFilter={upsertSavedFilter}/>
            </div>
        </Overlay>
        {savedFilters?.map(s => {
                    return (
                    <div onClick={() => handleSavedFilterClick(s)}>

                            <p className="pb-1 saved-filter-item">
                                {s.title}
                                <div className="saved-filter-action">
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={
                                            <Tooltip>
                                                {s.tooltip?.map(t => (
                                                    <p>{t}</p>
                                                ))}
                                            </Tooltip>
                                        }
                                        className="tooltipHover"
                                    >
                                    <i className="fal fa-info-circle"></i>
                                    </OverlayTrigger>
                                    <Overlay target={target.current} show={openEdit} placement="right">
                                        <div>
                                            <UpdateSavedFilterPanel openEdit={openEdit} setOpenEdit={setOpenEdit} upsertSavedFilter={upsertSavedFilter} filterTitle={s.title} tooltip={s.tooltip} global={s.global} filterId={s.id}/>
                                        </div>
                                    </Overlay>
                                    <i onClick={() => handleUpdateSavedFilter()}className="far fa-edit"></i>
                                    <i onClick={() => handleSavedFilterRemoval(s.id)} className="fas fa-trash red"></i>
                                </div>
                            </p>

                    </div>
                    )
                    })}
        </>
    )
}

const NewSavedFilterPanel = React.forwardRef(({setOpen, upsertSavedFilter}) => {
    const [title, setTitle] = useState("");
    const [checkbox, setCheckbox] = useState(false)

    const handleUpdateTitle = (e) => {
        setTitle(e.target.value)
    }

    const handleUpdateCheckbox = (e) => {
        setCheckbox(e.target.checked)
    }

    const handleCancelClick = () => {
        setTitle("")
        setCheckbox(false);
        setOpen(false)
    }

    const handleSaveClick = () => {
        setTitle("")
        setCheckbox(false);
        upsertSavedFilter('insert', {'title':title, 'global':checkbox})
    }

    return (
        <Popover className="test">
            <Popover.Header><p>Add Saved Filter</p></Popover.Header>
            <Popover.Body>
                <div className="saved-filter-body">
                    <Form.Label htmlFor="saved-filter-title">Title</Form.Label>
                    <Form.Control onChange={handleUpdateTitle} value={title} id='saved-filter-title'/>

                    <div className="saved-filter-control">
                      <div className="one">
                        <Form.Group>
                        <Form.Check
                        name="saved"
                        onClick={handleUpdateCheckbox}
                        checked={checkbox}
                        type="checkbox"
                        id='saved-filter-check'
                        label="Save as Global Filter"
                        />
                        </Form.Group>
                      </div>
                    </div>


                    <Form.Text className="mt-2 mb-2">*Note: This saved filter will be saving the current filter selection</Form.Text>

                    <div className="saved-filter-action-bar">
                        <Button onClick={handleSaveClick}>Save</Button>
                        <Button className="btn-clear" onClick={handleCancelClick}>Cancel</Button>
                    </div>
                </div>

            </Popover.Body>
        </Popover>
    )
})

const UpdateSavedFilterPanel = React.forwardRef(({filterId, setOpenEdit, openEdit, upsertSavedFilter, filterTitle, global, tooltip}) => {
    const [title, setTitle] = useState("");
    const [checkbox, setCheckbox] = useState(false)
    const [id, setId] = useState("")

    useEffect(() => {
        setTitle(filterTitle)
        setCheckbox(global)
        setId(filterId)
    },[])

    const handleUpdateTitle = (e) => {
        setTitle(e.target.value)
    }

    const handleUpdateCheckbox = (e) => {
        setCheckbox(e.target.checked)
    }

    const handleCancelClick = () => {
        setTitle("")
        setCheckbox(false);
        setId("")
        setOpenEdit(false)
    }

    const handleSaveClick = () => {
        setTitle("")
        setCheckbox(false);
        setId("")
        upsertSavedFilter('update', {'id':id, 'title':title, 'global':checkbox})
    }

    return (
        <Popover className="test">
            <Popover.Header>Update Saved Filter</Popover.Header>
            <Popover.Body>
                <div className="saved-filter-body">
                    <Form.Label htmlFor="saved-filter-title">Title</Form.Label>
                    <Form.Control onChange={handleUpdateTitle} value={title} id='saved-filter-title'/>

                    <div className="saved-filter-control">

                    <div className="one">
                      <Form.Group>
                      <Form.Check
                      name="saved"
                      onClick={handleUpdateCheckbox}
                      checked={checkbox}
                      type="checkbox"
                      id='saved-filter-check'
                      label="Save as Global Filter"
                      />
                      </Form.Group>
                    </div>

        
                    </div>

                    <div>

                    </div>
                    <Form.Text>
                        <div className="saved-filter-update-tooltip">
                            {tooltip?.map(t => (
                                <p>{t}</p>
                            ))}
                        </div>
                    </Form.Text>

                    <div className="saved-filter-action-bar">
                        <Button onClick={handleSaveClick}>Update</Button>
                        <Button className="btn-clear" onClick={handleCancelClick}>Cancel</Button>
                    </div>
                </div>

            </Popover.Body>
        </Popover>
    )
})
