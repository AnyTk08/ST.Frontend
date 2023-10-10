import React from "react";
import ListSubMenu from "./ListSubMenu";

const ListHeadMenu = ({
    dataMenu,
    sidebar,
    setIsDrawerMenu
}) => {

    return (
        <>
            {
                dataMenu && dataMenu.length > 0 ?
                    <>
                        {
                            dataMenu.map((itemHead, index) => {
                                return (
                                    <ListSubMenu
                                        key={itemHead.sMenuID}
                                        sKey={itemHead.sMenuID ?? index}
                                        dataMenu={itemHead}
                                        sidebar={sidebar}
                                        setIsDrawerMenu={setIsDrawerMenu}
                                    />
                                )
                            })
                        }
                    </>
                    : null}
        </>
    )
}

export default ListHeadMenu