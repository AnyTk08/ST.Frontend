import React, { Fragment, useMemo } from "react";
import Grid from "@mui/material/Grid";
import ItemRow from "./ItemRow";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Checkbox, FormControlLabel } from "@mui/material";
import _ from "lodash";
import { BtnDeleteOnTable } from "components/Button";
import { FnDialog } from "utilities/ST_Function";
import i18n from "config/i18nConfig";



const DisplayListRow = (props: any) => {

  const {
    IsCrop,
    cropShape,
    cropRatio,
    cropResize,
    cropMovable,
    IsHide=false
  } = props;

  const DialogFn = FnDialog();
  const [selected, setSelected] = React.useState<readonly string[]>([]);

  const newArrFile = useMemo(() => {
    let arr = [] as any;
    if (props.arrFile) {
      arr = Array.from(props.arrFile);
    }
    return arr;
  }, [props.arrFile])

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(newArrFile);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    props.SetarrFile(items);
  };

  const onHandleDelete = () => {
    DialogFn.Submit(
      i18n.t("msgConfirmSave")
      , () => {
        DialogFn.Success(i18n.t('msgSaveComplete'));
        DialogFn.CloseSubmit()
        DialogFn.UnBlockUI();
         let arrNew = _.filter(newArrFile, (item) => {
        return !selected.includes(item.nFile_ID);
      });
      //Delete File un-used
      selected.forEach(nFile_ID => {
        props.onDeleteFileInLocation(nFile_ID)
      });
      props.SetarrFile(arrNew);
      }
    )
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = newArrFile.map((n) => n.nFile_ID);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (nFile_ID: string) => {
    const selectedIndex = selected.indexOf(nFile_ID);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, nFile_ID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (nFile_ID: string) => selected.indexOf(nFile_ID) !== -1;

  return (
    <Fragment>
      <Grid
        container
        justifyContent="flex-start"
        alignItems="center"
      >
        {props.IsMultiDelete && !IsHide &&
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item >
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < newArrFile.length}
                      checked={newArrFile.length > 0 && selected.length === newArrFile.length}
                      onChange={handleSelectAllClick}
                    />
                  }
                  label="Check All"
                  style={{ marginLeft: '12px' }}
                />
              </Grid>
              <Grid item >
                {
                  selected.length > 0 ?
                    <BtnDeleteOnTable id={"delete-onTable"} txt="ลบ" onClick={onHandleDelete} />
                    : null
                }
              </Grid>
            </Grid>
          </Grid>
        }
        <Grid item xs={12} style={{ padding: "0 8px" }}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="lstFile">
              {(provided) => (
                <ul
                  className={"mui-style-lstFile"}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {newArrFile.map((f, i) => {
                    let sKey = f.nFile_ID + "";
                    return (
                      <Draggable
                        key={sKey}
                        draggableId={sKey}
                        index={i}
                        isDragDisabled={!props.IsDrag || props.disabled}
                      >
                        {(provided) => (
                          <li
                            style={{ padding: '4px 0px' }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ItemRow
                              key={f.index}
                              IsopenPopUp={props.IsopenPopUp}
                              setIsopenPopUp={props.setIsopenPopUp}
                              IsCrop={IsCrop}
                              cropShape={cropShape}
                              cropRatio={cropRatio}
                              cropResize={cropResize}
                              cropMovable={cropMovable}
                              arrObjFile={props.arrObjFile}
                              sFileType={f.sFileType}
                              sFileName={f.sFileName}
                              sPath={f.sPath}
                              sSize={f.sSizeName}
                              IsCompleted={f.IsCompleted}
                              IsProgress={f.IsProgress}
                              sProgress={f.sProgress}
                              sFolderName={f.sFolderName}
                              onDelete={props.onDelete}
                              nFile_ID={f.nFile_ID}
                              sUrl={f.sUrl}
                              sCropFileLink={f.sCropFileLink}
                              sFileLink={f.sFileLink}
                              disabled={props.disabled}
                              onOpenFile={props.onOpenFile}
                              IsHiddenUploadBox={props.IsHiddenUploadBox}
                              setStartVideoOn={props.setStartVideoOn}
                              nStartVideoOn={props.nStartVideoOn}
                              CannotSkipForward={props.CannotSkipForward}
                              onVideoEnd={props.onVideoEnd}
                              onDeleteFileInLocation={props.onDeleteFileInLocation}
                              SendCropImage={props.SendCropImage}
                              //Delete multi
                              IsMultiDelete={props.IsMultiDelete}
                              handleSelectAllClick={handleSelectAllClick}
                              handleClick={handleClick}
                              isSelected={isSelected}
                              onHandleDelete={onHandleDelete}
                              sPopup={props.sPopup}
                              IsHide={IsHide}
                            />
                            <hr style={{ margin: '0', borderColor: '#ebeef1', opacity: 0.4 }} />
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>
      </Grid>
    </Fragment>
  );
};
export default DisplayListRow;