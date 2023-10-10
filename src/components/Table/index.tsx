import React, { useState, useRef, useCallback, useEffect, useContext, createContext } from "react";
import { HeaderProp, TableProp, ColHeaderProp, ColBodyProp, RowBodyProp } from './TableProp';
import './Table.css';
import { AiOutlineUpCircle, AiOutlineDownCircle } from "react-icons/ai";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const TableContext = createContext(null);
const useStickyHeader = (defaultSticky = false) => {
    const [isSticky, setIsSticky] = useState(defaultSticky);
    const tableRef = useRef(null);
    const tableCon = useRef(null);
    const [isTop, setisTop] = useState(0);
    const [isBotton, setisBotton] = useState(0);
    const toggleStickiness = useCallback(
        ({ top, bottom }) => {
            if (top <= 0 && bottom > (2 * 50)) { //&& bottom > (2 * 68)
                !isSticky && setIsSticky(true);

            } else {
                isSticky && setIsSticky(false);
            }

            setisTop(top > 0 ? top : (top * (-1)))
        },
        [isSticky]
    );

    useEffect(() => {
        const handleScroll = () => {
            toggleStickiness(tableRef.current.getBoundingClientRect());
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [toggleStickiness]);
    useEffect(() => {
        if (tableCon) {
            setisBotton(tableCon.current.clientHeight - tableCon.current.offsetHeight);
        }
    }, [tableCon?.current?.clientHeight, tableCon?.current?.offsetHeight]);
    return { tableRef, isSticky, isTop, isBotton, tableCon };
};


export const Table = (prop: TableProp) => {
    const { tableRef, isSticky, isTop, tableCon } = useStickyHeader();
    const onScroll = (e) => {
        let TableID: any = e.target.children;
        let s: any = Array.from(TableID[0].getElementsByClassName("stickycol"));
        if (e.target.scrollLeft > 0) {
            let width_1 = 0;
            let th_ = [];
            let td_ = [];
            s.forEach((f, i) => {
                if (f.localName == "td") {
                    if (f.cellIndex == 0) {
                        f.classList.add("stickycolCell0");
                    }
                    td_.push(f);
                } else if (f.localName == "th") {
                    th_.push(f);
                }

            })
            th_.forEach((f, i) => {
                if (f.cellIndex > 0) {
                    f.classList.add("stickyshadow");
                    width_1 = width_1 + f.clientWidth + th_[0].clientWidth;
                    f.style.left = "calc(" + (width_1 - f.clientWidth) + "px + 0px)"
                    let arrTd = td_.filter(w => w.cellIndex == f.cellIndex);
                    arrTd.forEach(x => {
                        x.classList.add("stickyshadow");
                        x.style.left = f.style.left;
                    })
                } else {
                    f.classList.add("stickycolCell0");
                }
            })
            let arrcolSpan = td_.filter(w => w.colSpan > 1);
            arrcolSpan.forEach(f => {
                f.classList.add("stickyshadow");
            })
        } else if (e.target.scrollLeft == 0) {
            if ((s || []).length > 1 && s[1].style && s[1].style?.left) s[1].style.left = "";
            s.forEach((f, i) => {
                f.classList.remove("stickyshadow");
                f.classList.remove("stickycolCell0");
                f.style.left = "";
            })
        }
        let s1: any = Array.from(TableID[1].getElementsByClassName("stickycol"));
        if (e.target.scrollLeft > 0) {
            let width_1 = 0;
            let th_ = [];
            let td_ = [];
            s1.forEach((f, i) => {
                if (f.localName == "td") {
                    if (f.cellIndex == 0) {
                        f.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px";

                        f.classList.add("stickycolCell0");
                    } else {
                        f.classList.add("stickyshadow");
                    }
                    td_.push(f);
                } else if (f.localName == "th") {
                    th_.push(f);
                }

            })

            th_.forEach((f, i) => {

                if (f.cellIndex > 0) {
                    f.classList.add("stickyshadow");
                    width_1 = width_1 + f.clientWidth + th_[0].clientWidth;
                    f.style.left = "calc(" + (width_1 - f.clientWidth) + "px + 0px)"

                    let arrTd = td_.filter(w => w.cellIndex == f.cellIndex);

                    arrTd.forEach(x => {
                        x.classList.add("stickyshadow");
                        x.style.left = f.style.left;
                        x.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px";
                    })
                } else {
                    f.classList.add("stickycolCell0");
                }

            })
            td_.forEach(f => {
                let left = 0;
                let ds = (td_ || []).filter(x => x.localName == "td")[f.cellIndex - 1];
                if (ds) {
                    left = f.cellIndex > 0 ? left + ds.clientWidth : 0;
                    if (f.cellIndex == 2) {
                        let ds1 = (td_ || []).filter(x => x.localName == "td")[f.cellIndex - 1];
                        let ds2 = (td_ || []).filter(x => x.localName == "td")[f.cellIndex - 2];
                        left = (ds1 && ds2) ? ds1.clientWidth + ds2.clientWidth : 0;
                    }
                    f.style.left = "calc(" + left + "px + " + (f.cellIndex - 1) + "px)"
                }
                f.classList.add("stickyshadow");
                f.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px";

            })
        } else if (e.target.scrollLeft == 0) {
            if ((s1 || []).length > 1 && s1[1].style && s1[1].style?.left) s1[1].style.left = "";
            s1.forEach((f, i) => {
                f.classList.remove("stickyshadow");
                f.classList.remove("stickycolCell0");
                f.style.left = "";
                f.style.boxShadow = "";

            })
        }
    };

    return (
        <TableContext.Provider value={prop}>
            <div style={{ border: "1px solid #d9d9d9" }} ref={tableCon} className="contentTable" onScroll={onScroll} id={"div_" + prop.id} key={"div_" + prop.id}>
                <div id={"Sticky_" + prop.id} style={{
                    width: tableRef?.current?.getBoundingClientRect()?.width + "px",
                    top: 125,
                    transform: "translateY(" + (isTop + 20) + "px)",
                    display: isSticky ? "block" : "none",
                }} className="st-div-sticky">
                    <table {...prop}
                        className="STsticky"
                        id={"STsticky-" + prop.id}
                        style={{
                            tableLayout: "fixed",
                        }}>
                        <Header>{prop.renderheader}</Header>
                    </table>
                </div>
                <table ref={tableRef} {...prop}>
                    <Header>{prop.renderheader}</Header>
                    {prop.children}
                    <tfoot> {prop.renderfooter}</tfoot>
                </table>
            </div>
            {prop.isShowPagination && <div style={{ float: "right", marginBottom: "10px" }}>
                <TablePaginationUI nPageIndex={prop.nPageIndex} nPageSize={prop.nPageSize} onChangePage={prop.onChangePage} nDataLength={prop.nDataLength} />
            </div>}
        </TableContext.Provider >
    )
}

export const ColHeader = (prop: ColHeaderProp) => {
    return (<th {...prop} className={prop.isSticky ? "stickycol " : "" + prop.className || ""} style={{ width: prop.width, textTransform: "none", ...prop.style }}>{prop.children}</th>)
};

export const Row = (prop: RowBodyProp) => {
    const _TableContext = useContext(TableContext);
    const key = makeid(5);
    const setLavel = (value) => {
        let res = "";
        if (value == 1) {
            res = "25px";
        } else if (value == 2) {
            res = "45px";
        } else if (value == 3) {
            res = "50px";
        } else if (value == 4) {
            res = "70px";
        } else if (value == 5) {
            res = "95px";
        } else if (value == 6) {
            res = "125px";
        }
        return res;
    }

    const setparent = (value) => {
        let res = "";
        if (value) {
            res = "none";
        }
        return res;
    }

    const setExpand = (id, mode) => {
        let className: any = Array.from(document.getElementsByClassName(_TableContext.id + "_parent_tr_" + id));
        if (className) {
            className.forEach(element => {
                element.style.display = mode;
                if (mode == "") {
                    if (id == element.id) {
                        setExpand(element.id, mode);
                    }
                } else {
                    setExpand(element.id, mode);
                    if (element.style.display == "none") {
                        let btnClose = document.getElementById(key + "btn_colap_Close" + element.id);
                        if (btnClose) btnClose.style.display = "";
                        let btnShowe = document.getElementById(key + "btn_colap_Show" + element.id);
                        if (btnShowe) btnShowe.style.display = "none";
                    }
                }
            });
        }
    }

    return (
        <tr style={{ display: setparent(prop.parentID), ...prop.style }} {...prop}
            className={(prop.parentID ? _TableContext.id + "_parent_tr_" + prop.parentID : "") + (prop.className ?  " " + prop.className : "")}>

            {React.Children.map(prop.children, (child, index) => {
                if (React.isValidElement(child)) {
                    if (prop.isExpand && index == 0) {
                        return (
                            <ColBody {...child.props}>
                                <div style={{ display: "flex", marginLeft: setLavel(prop.level) }}>

                                    <AiOutlineDownCircle id={key + "btn_colap_Close" + prop.id} style={{
                                        marginRight: "4px",
                                        color: "#003dad",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        display: "none"
                                    }} onClick={() => {
                                        setExpand(prop.id + "", "");
                                        let btnClose = document.getElementById(key + "btn_colap_Close" + prop.id);
                                        if (btnClose) btnClose.style.display = "none";
                                        let btnShowe = document.getElementById(key + "btn_colap_Show" + prop.id);
                                        if (btnShowe) btnShowe.style.display = "";
                                    }} />

                                    <AiOutlineUpCircle id={key + "btn_colap_Show" + prop.id} style={{
                                        marginRight: "4px",
                                        color: "#003dad",
                                        fontSize: "20px",
                                        cursor: "pointer",

                                    }} onClick={() => {


                                        setExpand(prop.id, "none");
                                        let btnClose = document.getElementById(key + "btn_colap_Close" + prop.id);
                                        if (btnClose) btnClose.style.display = "";
                                        let btnShowe = document.getElementById(key + "btn_colap_Show" + prop.id);
                                        if (btnShowe) btnShowe.style.display = "none";
                                    }} />
                                    {child.props.children}
                                </div>
                            </ColBody>
                        )
                    } else if (prop.level && index == 0) {
                        return (
                            <ColBody {...child.props}>
                                <div style={{ display: "flex", marginLeft: setLavel(prop.level) }}>
                                    {child.props.children}
                                </div>
                            </ColBody>
                        )
                    }
                    else {
                        return child;
                    }
                }
            })}

        </tr>
    )
};

export const ColBody = (prop: ColBodyProp) => {
    return (<td  {...prop} className={prop.isSticky ? "stickycol " : "" + prop.className || ""}>{prop.children} </td>)
};

export const Header = (prop: HeaderProp) => {
    return (
        <thead {...prop}>
            {prop.children}
        </thead>
    );
};

export const Body = (prop: HeaderProp) => {
    return (
        <tbody {...prop}>
            {prop.children}
        </tbody>
    );
};

export const NoData = (prop: ColBodyProp) => {
    return (<tr id={prop.id}><td {...prop} className="cTdNoData" style={{ backgroundColor: "#fcf8e3", borderColor: "#faebcc", color: "#8a6d3b", textAlign: "center" }}><div>ไม่พบข้อมูล</div></td></tr>)
};

export function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export const TablePaginationUI = (props: PaginationInterface) => {
    const [page, setPage] = React.useState(props.nPageIndex || 1);
    const [pageCount, setpageCount] = React.useState(props.nPageSize || 10);
    const [nDataLength, setnDataLength] = React.useState(props.nDataLength || 0);

    useEffect(() => {
        setnDataLength(props.nDataLength || 0)
    }, [props.nDataLength])
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        if(props.onChangePage){
            props.onChangePage({ nDataLength: nDataLength, nPageIndex: newPage, nPageSize: pageCount });
        }
    };

    const handlePageCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setpageCount(+event.target.value)
        setPage(1);
        if(props.onChangePage){
            props.onChangePage({ nDataLength: nDataLength, nPageIndex: 1, nPageSize: +event.target.value });
        }
    }

    return (
        <div style={{ textAlign: "end", marginTop: "10px", width: "100%", display: "flex" }}>
            <div style={{ marginTop: "8px", marginRight: "12px" }}>
                {page} - {Math.ceil(nDataLength / pageCount)} of {nDataLength}
            </div>
            {nDataLength > 9 &&
                <>
                    <Pagination count={Math.ceil(nDataLength / pageCount)} variant="outlined" shape="rounded" page={page} onChange={handleChangePage} style={{ right: "0" }} />
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={pageCount}
                        onChange={() => handlePageCount}
                        autoWidth
                        size="small"
                        style={{ height: "31px", marginLeft: "10px" }}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </>
            }
        </div>
    )
}
export interface PaginationInterface {
    nPageIndex?: number;
    nPageSize?: number;
    nDataLength?: number;
    onChangePage?: (data: { nPageIndex?: number, nPageSize?: number, nDataLength?: number }) => void;
}

export function fnPagination( PageDaa: { nPageIndex?: number, nPageSize?: number, nDataLength?: number } , ArrayData = []) {
    let lst = ArrayData.slice((PageDaa.nPageIndex - 1) * PageDaa.nPageSize, (PageDaa.nPageIndex) * PageDaa.nPageSize);
    return lst;
}