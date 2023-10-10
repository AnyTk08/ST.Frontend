import { useContext, createContext, useEffect } from "react";
import './Tab.css'
import { TabContentProp, TabItemProp, TabPanelProp, TabsProp } from "./Tab";

const TabsContext = createContext(null);

const Tabs = (props: TabsProp) => {

    return (
        <div className="pcss3t pcss3t-effect-scale pcss3t-theme-1 pcss3t-height-auto">
            <TabsContext.Provider value={props}>
                {props.children}
            </TabsContext.Provider>
        </div>
    )
}
export default Tabs;

export const TabItem = (props: TabItemProp) => {
    const { defaultTab, onTabChange } = useContext(TabsContext);

    const onClickTabItem = (tabId) => {
        let cTablabel = document.getElementsByClassName("cTablabel");
        for (const element of cTablabel) {

            const slide = element as HTMLElement;
            if (slide.id == tabId) {
                slide.style.marginBottom = "0";
                slide.style.paddingBottom = "8px";
                slide.style.opacity = "1";
                slide.style.borderBottomRightRadius = "0px";
                slide.style.borderBottomLeftRadius = "0px";
                slide.style.color = "#0a4179";
                slide.style.background = "rgb(255 255 255 / 91%)";
                slide.style.cursor = "default";
                slide.style.boxShadow = "rgba(0, 10, 74, 0.23) 0px 5px 2px 0px inset";
                slide.style.zIndex = "2";
            } else {
                slide.style.margin = "2px 5px 1.8px 2px";
                slide.style.borderRadius = "5px";
                slide.style.boxShadow = "rgba(169, 182, 187, 0.28) 0px 10px 36px 0px, rgba(143, 159, 165, 0.25) 0px 0px 0px 1px";
                slide.style.color = "#ffffff";
                slide.style.paddingBottom = "0";
                slide.style.cursor = "pointer";
                slide.style.zIndex = "1";
                slide.style.backgroundImage = 'linear-gradient(182deg, #00075cdb 0%, #00086940 100%)';
            }
        }
        let tabcontent = document.getElementsByClassName("tab-content");
        for (const element of tabcontent) {
            const slide = element as HTMLElement;
            slide.style.display = "none";
            slide.style.borderBottom = '10%';
        }
        let tset = document.getElementById("TabPanel_" + tabId);
        if (tset) {
            tset.style.display = "block";
            tset.style.zIndex = "1";
            tset.style.opacity = "1";
            tset.style.top = "0";
            tset.style.left = "0";
            tset.style.webkitTransform = "scale(1,1)";
            tset.style.webkitTransform = "rotate(0deg)";
            tset.style.borderBottom = '10%';
        }
        if (onTabChange) {
            onTabChange(tabId);
        }
    }

    useEffect(() => {
        if (defaultTab) {
            onClickTabItem(defaultTab)
        }
    }, [defaultTab])
    return (
        <>
            <label className="cTablabel" id={props.id} onClick={() => {
                onClickTabItem(props.id)
            }}>{props.children}</label>
        </>
    )
}

export const TabContent = (prop: TabContentProp) => {
    return (
        <ul>
            {prop.children}
        </ul>
    )
}

export const TabPanel = (prop: TabPanelProp) => {
    return (
        <li className="tab-content" id={"TabPanel_" + prop.id}>
            {prop.children}
        </li>
    )
}