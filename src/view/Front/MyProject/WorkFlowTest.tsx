//#region import
import React , { useEffect, useState }  from 'react';
import { AxiosGet, AxiosPost } from 'utilities/ST_Axios';
import { Grid } from '@mui/material';
import { TextBoxForm } from 'components/Input/TextBox';
import { SwitchForm } from 'components/Input/Switch';
import { SelectFormItem,} from 'components/Input/Select';
import AccordionCustom from 'components/Accordion/AccordionCustom';
import { FnDialog, undefinedOrNull } from 'utilities/ST_Function';
import i18n from 'config/i18nConfig';

//#region Yup
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import { FormProvider, useForm } from 'react-hook-form';
//#endregion

//#region Button
import {
  BtnAdd, 
  BtnSave 
} from 'components/Button';
//#endregion

//#region Table
import DataGrid, { PaginationInterface, initRows } from "components/DataGrid";
import {  GridColumns } from "@mui/x-data-grid-pro";
import { AlertMsg, AlertTitle } from "config/AlertMsgConfig";
import { FilterFieldInterface } from "components/DataGrid/DataGridProps";
import { SwAlert } from 'components/Alert';
//#endregion

//#endregion

const ControllerAPI = "WorkFlow";
const WorkFlowTest = () => {
  const DialogFn = FnDialog();
  const [arrProject, SetarrProject] = useState<any>([]);
  const [arrStatus, SetarrStatus] = useState<any>([]);
  const [arrArea, SetarrArea] = useState<any>([]);

  const arrModeSave = [
    // { value: "0", label: "Cancel (ยกเลิก)", },
    { value: "1", label: "Save Draft (บันทึกร่าง)", },
    { value: "2", label: "Submit (ขออนุมัติ)", },
    { value: "3", label: "Request Edit (ส่งคำขอแก้ไข)", },
    { value: "4", label: "Approved (อนุมัติ)", },
    { value: "5", label: "Reject (ส่งกลับแก้ไข)", }
  ];

  //#region Yup validation
  const objSchema = yup.object().shape({
    nProjectID: yupFormSchemas.string("Project ID", { required: true }),
    nModeSaveID: yupFormSchemas.string("Mode Save ID", { required: true }),
  });

  const form = useForm({
    resolver: yupResolver(objSchema),
    shouldUnregister: false,
    shouldFocusError: true,
    mode: "all",
  });
  //#endregion

  //#region Table Add
  const [loading, SetLoading] = useState(false);
  const [DataRow, SetDataRow] = useState<PaginationInterface>({
    ...initRows,
    sSortExpression: "dUpdate",
    sSortDirection: "desc"
  });

  //#region Form Yup
  const initSchema = {};
  const [SchemaObj_Add, SetSchemaObj_Add] = useState(() => {
    return initSchema;
  });
  const schema_Add = yup.object().shape(SchemaObj_Add);
  const form_Add = useForm({
    resolver: yupResolver(schema_Add),
    mode: 'all',
    shouldFocusError: false,
    criteriaMode: "firstError",
  });

  useEffect(() => {
    if (DataRow.arrRows.length > 0) objSchema_Add();
  }, [DataRow.arrRows]);

  const objSchema_Add = () => {
    let newSchema = initSchema;
    let lstdata = DataRow.arrRows as any;
    lstdata.forEach(item => {
      newSchema[`nAreaID_${item.sID}`] = yupFormSchemas.string("Area", { required: true });
      newSchema[`sComment_${item.sID}`] = yupFormSchemas.string("Comment", { required: false });      
      newSchema[`nRoundUpdate_${item.sID}`] = yupFormSchemas.string("Around", { required: false });
      newSchema[`IsSendEmail_DV_${item.sID}`] = yupFormSchemas.string("Send Email DV", { required: false });
      newSchema[`IsSendEmail_VP_${item.sID}`] = yupFormSchemas.string("Send Email VP", { required: false });
      newSchema[`IsSendEmail_AE_${item.sID}`] = yupFormSchemas.string("Send Email AE", { required: false });
      newSchema[`IsRequestEdit_${item.sID}`] = yupFormSchemas.string("Request Edit", { required: false });
    });
    SetSchemaObj_Add(newSchema);
  };
  //#endregion

  const onAddData = () => {
    SetLoading(true);
    let AddDataRow = [...DataRow.arrRows] as any;
    let nID = AddDataRow.length > 0 ? Math.max.apply(Math, AddDataRow.map(function (obj) { return obj.sID; })) + 1 : 1;
    AddDataRow.push({
      sID: nID + "",
      isDel: false,
      nAreaID: null,
      sComment: null,
      IsSendEmail_DV: null,
      IsSendEmail_VP: null,
      IsSendEmail_AE: null,
      nRoundUpdate: null,
      IsRequestEdit: false,
      isStatusEdit: false,
    });
    let _arrData = AddDataRow.filter(f => f.isDel === false);
    SetDataRow({
      ...DataRow,
      arrRows: _arrData,
      nDataLength: _arrData.length,
      nPageIndex: 0, //ต้องใส่นะจร๊ ถ้าไม่ใส่ ต่อให้ข้อมูลมีกี่ตัวก็ตาม แต่ตารางจะโชว์ข้อมูลแค่ 1 ตัวแบบอันล่าสุด 
    })
    SetLoading(false);
  }

  const dataColumn: GridColumns = [
    {
      field: "nAreaID",
      headerName: "Area ID",
      headerAlign: "center",
      align: "center",
      sortable: true,
      resizable: false,
      flex: 3,
      renderCell: (item) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: '2%' }}>
            <FormProvider {...form_Add}>
              <form>
                <SelectFormItem
                  id={"nAreaID_" + item.row.sID}
                  name={"nAreaID_" + item.row.sID}
                  required={true}
                  disabled={false}
                  options={arrArea}
                  isMessageError={false}
                  fullWidth={true}
                  onChange={(e) => {
                    let nAreaID = e ? undefinedOrNull(e.value, "number") : null;
                    let IsQbj = (DataRow.arrRows || []).filter(f => f.nAreaID == nAreaID);
                    if (IsQbj.length == 0) {
                      item.row.nAreaID = nAreaID;
                    } else {
                      form_Add.setValue("nAreaID_" + item.row.sID, null);
                    }
                  }}
                  isPopperCustom={false}
                />
              </form>
            </FormProvider>
          </Grid>
        );
      }
    },
    {
      field: "sComment",
      headerName: "Comment",
      headerAlign: "center",
      align: "left",
      sortable: true,
      resizable: false,
      flex: 4,
      renderCell: (item) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: '2%' }}>
            <FormProvider {...form_Add}>
              <form>
                <TextBoxForm
                  id={"sComment_" + item.row.sID}
                  name={"sComment_" + item.row.sID}
                  required={false}
                  disabled={false}
                  maxLength={2000}
                  multiline={true}
                  fullWidth={true}
                  rows={2}
                  onChange={(e) => {
                    item.row.sComment = e;
                  }}
                />
              </form>
            </FormProvider>
          </Grid>
        );
      }
    },
    {
      field: "nRoundUpdate",
      headerName: "Around",
      headerAlign: "center",
      align: "left",
      sortable: true,
      resizable: false,
      flex: 1,
      renderCell: (item) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: '2%' }}>
            <FormProvider {...form_Add}>
              <form>
                <TextBoxForm
                  id={"nRoundUpdate_" + item.row.sID}
                  name={"nRoundUpdate_" + item.row.sID}
                  required={false}
                  disabled={false}
                  maxLength={2}
                  fullWidth={true}
                  onChange={(e) => {
                    item.row.nRoundUpdate = e ? undefinedOrNull(e, "number") : null;
                  }}
                />
              </form>
            </FormProvider>
          </Grid>
        );
      }
    },    
    {
      field: "IsSendEmail_DV",
      headerName: "DV (ผู้จัดการส่วน)",
      headerAlign: "center",
      align: "center",
      sortable: true,
      resizable: false,
      flex: 2,
      renderCell: (item) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: '2%' }}>
            <FormProvider {...form_Add}>
              <SwitchForm
                name={"IsSendEmail_DV_" + item.row.sID}
                LeftText="ส่งอีเมล"
                RightText="ไม่ส่งอีเมล"
                required={false}
                disabled={false}
                width={90}
                onChange={(e) => {
                  item.row.IsSendEmail_DV = e;
                }}
              />
            </FormProvider>
          </Grid>
        );
      }
    },
    {
      field: "IsSendEmail_VP",
      headerName: "VP (ผู้จักการฝ่่าย)",
      headerAlign: "center",
      align: "center",
      sortable: true,
      resizable: false,
      flex: 2,
      renderCell: (item) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: '2%' }}>
            <FormProvider {...form_Add}>
              <SwitchForm
                name={"IsSendEmail_VP_" + item.row.sID}
                LeftText="ส่งอีเมล"
                RightText="ไม่ส่งอีเมล"
                required={false}
                disabled={false}
                width={90}
                onChange={(e) => {
                  item.row.IsSendEmail_VP = e;
                }}
              />
            </FormProvider>
          </Grid>
        );
      }
    },
    {
      field: "IsSendEmail_AE",
      headerName: "AE (ผจ.)",
      headerAlign: "center",
      align: "center",
      sortable: true, //การ Sort Data Columns > false = ปิด / true เปิด
      resizable: false,
      flex: 2,
      renderCell: (item) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: '2%' }}>
            <FormProvider {...form_Add}>
              <SwitchForm
                name={"IsSendEmail_AE_" + item.row.sID}
                LeftText="ส่งอีเมล"
                RightText="ไม่ส่งอีเมล"
                required={false}
                disabled={false}
                width={90}
                onChange={(e) => {
                  item.row.IsSendEmail_AE = e;
                }}
              />
            </FormProvider>
          </Grid>
        );
      }
    },
    {
      field: "IsRequestEdit",
      headerName: "Request Edit",
      headerAlign: "center",
      align: "center",
      sortable: true, //การ Sort Data Columns > false = ปิด / true เปิด
      resizable: false,
      flex: 2,
      renderCell: (item) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: '2%' }}>
            <FormProvider {...form_Add}>
              <SwitchForm
                name={"IsRequestEdit_" + item.row.sID}
                LeftText="แก้ไข"
                RightText="ไม่แก้ไข"
                required={false}
                disabled={false}
                width={90}
                onChange={(e) => {
                  item.row.IsRequestEdit = e;
                }}
              />
            </FormProvider>
          </Grid>
        );
      }
    },
    {
      field: "isStatusEdit",
      headerName: "Edit Project",
      headerAlign: "center",
      align: "center",
      sortable: true, //การ Sort Data Columns > false = ปิด / true เปิด
      resizable: false,
      flex: 2,
      renderCell: (item) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: '2%' }}>
            <FormProvider {...form_Add}>
              <SwitchForm
                name={"isStatusEdit_" + item.row.sID}
                LeftText="แก้ไข"
                RightText="ไม่แก้ไข"
                required={false}
                disabled={false}
                width={90}
                onChange={(e) => {
                  item.row.isStatusEdit = e;
                }}
              />
            </FormProvider>
          </Grid>
        );
      }
    },
  ];

  const onLoadData = (dataPagination = null) => {
    let _arrData = [...DataRow.arrRows];
    let p = dataPagination ? dataPagination : initRows;
    SetDataRow({
      ...p,
      arrRows: _arrData,
      nDataLength: _arrData.length,
    })
  }

  const onDelete = (sID) => {
    SwAlert.Confirm(AlertTitle.Confirm, AlertMsg.ConfirmDelete, () => {
      let lstRemoveData = sID ?? [];
      let _arrData = [...DataRow.arrRows];
      if (_arrData.length > 0) {
        _arrData = _arrData.filter(w => !lstRemoveData.includes(w.sID));
        SetDataRow({
          ...initRows,
          arrRows: _arrData,
          nDataLength: _arrData.length,
          nPageIndex: 0,
        })

        lstRemoveData.forEach(f => {
          //Remove Schema
          let CloneSchema = SchemaObj_Add;
          delete CloneSchema[`nAreaID_${f.sID}`];
          delete CloneSchema[`sComment_${f.sID}`];
          delete CloneSchema[`IsSendEmail_DV_${f.sID}`];
          delete CloneSchema[`IsSendEmail_VP_${f.sID}`];
          delete CloneSchema[`IsSendEmail_AE_${f.sID}`];
          SetSchemaObj_Add({ ...CloneSchema });
        });
      }
    });
  }
  //#endregion

  //#region Table Work Flow
  const [loadingWorkFlow, SetLoadingWorkFlow] = useState(false);
  const [DataRowWorkFlow, SetDataRowWorkFlow] = useState<PaginationInterface>({
    ...initRows,
    sSortExpression: "dUpdate",
    sSortDirection: "desc"
  });

  const dataColumnWorkFlow: GridColumns = [
    {
      field: "nProjectID",
      headerName: "Project ID",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    },
    {
      field: "sRequestTypeName",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    },    
    {
      field: "sAgencyName",
      headerName: "Area ID",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    },
    {
      field: "nRoundUpdate",
      headerName: "Around",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    }, 
    {
      field: "sStatusName", //"nStatus",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 2,
    },   
    {
      field: "sDescription",
      headerName: "Description",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 2,
    },   
    {
      field: "sActionBy",
      headerName: "Action By",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    },       
    {
      field: "sCloseProject",
      headerName: "Close Project",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    },    
    {
      field: "sComment",
      headerName: "Comment",
      headerAlign: "center",
      align: "left",
      sortable: false,
      resizable: false,
      flex: 2,
    },
    {
      field: "sSendEmail_DV",
      headerName: "DV (ส่วน)",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    },
    {
      field: "sSendEmail_VP",
      headerName: "VP (ฝ่่าย)",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    },
    {
      field: "sSendEmail_AE",
      headerName: "AE (ผจ.)",
      headerAlign: "center",
      align: "center",
      sortable: false, //การ Sort Data Columns > false = ปิด / true เปิด
      resizable: false,
      flex: 1,
    },
    {
      field: "sUpdate",
      headerName: "แก้ไขล่าสุด",
      headerAlign: "center",
      align: "center",
      sortable: false,
      resizable: false,
      flex: 1,
    },
  ];

  const filterField : FilterFieldInterface[] = [
    {
      sFieldName: "sSearch",
      sTypeFilterMode: "input",
      sLabel: "Area ID, Agency Name",
    },
    {
      sFieldName: "lstStatusID",
      sTypeFilterMode: "multiselect",
      sLabel: "Status",
      optionSelect: arrStatus,
    },
    {
      sFieldName: "lstProjectID",
      sTypeFilterMode: "multiselect",
      sLabel: "Project",
      optionSelect: arrProject ?? [],
    },
    // {
    //   sFieldName: "nStatusID",
    //   sTypeFilterMode: "select",
    //   sLabel: "Status",
    //   optionSelect: arrStatus,
    // },
    // {
    //   sFieldName: "nProjectID",
    //   sTypeFilterMode: "select",
    //   sLabel: "Project",
    //   optionSelect: arrProject ?? [],
    // },
  ];

  const onLoadDataWorkFlow = async (p: PaginationInterface) => {
    SetLoadingWorkFlow(true);
    await AxiosPost(`${ControllerAPI}/GetDataTableWorkFlowRequest`, p, (result) => {
      SetDataRowWorkFlow({
        ...p,
        arrRows: (result.lstDataRequest ?? []),
        nDataLength: result.nDataLength,
        nPageIndex: result.nPageIndex, //ต้องใส่นะจร๊ ถ้าไม่ใส่ ต่อให้ข้อมูลมีกี่ตัวก็ตาม แต่ตารางจะโชว์ข้อมูลแค่ 1 ตัวแบบอันล่าสุด 
      });
      SetLoadingWorkFlow(false);
    }, (err) => {
      console.log("err", err);
      if (!err.response) {
        SwAlert.Error(AlertTitle.Error, err.Message);
      }
    })
  }
  //#endregion

  useEffect(() => {
    LoadOptions();
    onLoadDataWorkFlow(DataRowWorkFlow);
  }, []);

  const LoadOptions = () => {
    DialogFn.BlockUI()
    AxiosGet(`${ControllerAPI}/LoadOptionsWorkFlow`, {}, (res) => {
      console.log("LoadOptionsWorkFlow > ", res);
      SetarrProject(res.Result.arrProject ?? []);
      SetarrStatus(res.Result.arrStatus ?? []);
    }, (err) => { }, DialogFn.UnBlockUI())
  };

  const onSaveWorkFlow = async () => {
    DialogFn.Submit(i18n.t("msgConfirmSave"), async () => {
      DialogFn.BlockUI();
        let lstDataArea = [];
        (DataRow.arrRows ?? []).forEach(f => {
          lstDataArea.push({
            nAreaID: f.nAreaID,
            sComment: f.sComment,
            nRoundUpdate: f.nRoundUpdate,
            IsSendEmail_DV: f.IsSendEmail_DV,
            IsSendEmail_VP: f.IsSendEmail_VP,
            IsSendEmail_AE: f.IsSendEmail_AE,
            IsRequestEdit: f.IsRequestEdit,
            isStatusEdit: f.isStatusEdit,
          });
        });

        let ObjData = form.getValues();
        let lstData = {
          nProjectID: undefinedOrNull(ObjData.nProjectID, "number"),
          nModeSave: undefinedOrNull(ObjData.nModeSaveID, "number"),
          lstDataArea: lstDataArea,
          IsRequestEdit: false,
        };
        console.log("onSaveWorkFlow > ", lstData);
        await AxiosPost(`${ControllerAPI}/UpdateDataWorkFlow`, lstData, (res) => {
          console.log("UpdateDataWorkFlow > ", res);
          DialogFn.CloseSubmit();
          DialogFn.UnBlockUI();

          if(res.StatusCode == "200")
          {
            if(res.Result.length > 0) {
              let Message = "";
              (res.Result).forEach((f)=> {
                Message += f.nAreaID + " > " + f.StatusCode + (f.Message != null ? " : " + f.Message : " = Success")+ " </br> ";
              });
              console.log("UpdateDataWorkFlow > Error Message ", Message);
              SwAlert.HtmlWarning(AlertTitle.Warning, Message);              
            } else {
              DialogFn.Success(i18n.t('msgSaveComplete'));              
            }
          } else {
            DialogFn.Warning(res.Message);
          }
        },(err) => {
          if(!err.response){ DialogFn.Warning(err.Message);}
        });
      }
    );
  };
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12}
        style={{
          background: 'rgba(255,255,255,0.2)',
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <AccordionCustom header={"Add/Update Work Flow"} >
          {/* <Grid item container justifyContent="flex-end" alignItems="flex-end"> 
            <BtnSave onClick={(e) => { onButtonStepWorkFlow(); }} />
          </Grid> */}

        {/* <Accordion key={"AddUpDate"} header='Add/UpDate Work Flow' onExpanded={true} bgcolor='#0154a4' boxRadius='10px 10px 0px 0px' color='white'> */}
          <FormProvider {...form}>
            <form>
              <Grid item xs={12} sm={12} md={12} lg={12} spacing={2} container direction="row" justifyContent="start" alignItems="start">
                <Grid item container spacing={2} xs={12} sm={12} md={12} lg={12}>
                  <Grid item container spacing={2} xs={12} sm={12} md={12} lg={12} direction="row" justifyContent={'start'}>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                      <SelectFormItem
                        id={"nProjectID"}
                        name={"nProjectID"}
                        label={"Project"}
                        required={true}
                        disabled={false}
                        options={arrProject}
                        onChange={(e) => {
                          SetDataRow({
                            ...initRows,
                            arrRows: [],
                            nDataLength: 0,
                          });
                          SetSchemaObj_Add([]);
                          SetarrArea(e?.arrArea.length > 0 ? e.arrArea : []);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                      <SelectFormItem
                        id={"nModeSaveID"}
                        name={"nModeSaveID"}
                        label={"Mode Save"}
                        required={true}
                        disabled={false}
                        options={arrModeSave}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} display={'flex'} justifyContent={'flex-end'}>
                    <BtnAdd id={"BtnAddUpdateWorkFlow"} onClick={form.handleSubmit((e) => { onAddData(); })} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <DataGrid
                      isLoading={loading}
                      columns={dataColumn}
                      rows={DataRow}
                      onLoadData={(dataPagination) => {
                        onLoadData(dataPagination);
                      }}
                      isShowCheckBox={true}
                      onDelete={onDelete}
                      handleDataMode='client'
                      isShowColomnTool={false}
                      isHiddenToolHead={true}
                      isNotShowPagination={true}
                    />
                  </Grid>
                </Grid>
                <Grid item container justifyContent="flex-end" alignItems="flex-end"> {/* BTN Save */}
                  <BtnSave id={"BtnSaveUpdateWorkFlow"} onClick={form.handleSubmit((e) => { onSaveWorkFlow(); })} />
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        {/* </Accordion> */}
        </AccordionCustom>
        <br />
        <AccordionCustom header={"Table Data Work Flow"}>
        {/* <Accordion key={"Table"} header='Table Data Work Flow' onExpanded={true} bgcolor='#06597a' boxRadius='10px 10px 0px 0px' color='white'> */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <DataGrid
              isLoading={loadingWorkFlow}
              columns={dataColumnWorkFlow}
              rows={DataRowWorkFlow}
              onLoadData={onLoadDataWorkFlow}
              isShowCheckBox={false}
              handleDataMode='server'
              filterField={filterField}
              modeFilter={1}
              groupRowByField='brand'
            />
          </Grid>
        {/* </Accordion> */}
        </AccordionCustom>
        <br/>
        <br/>
      </Grid>
    </Grid>
  )
}

export default WorkFlowTest;
