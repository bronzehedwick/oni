import { mount, shallow } from "enzyme"
import { shallowToJson } from "enzyme-to-json"
import * as React from "react"

jest.mock("../browser/src/Services/FileIcon")
import { FileIcon } from "../browser/src/Services/FileIcon"
jest.mock("../browser/src/UI/components/Sneakable")
import { Sneakable } from "../browser/src/UI/components/Sneakable"

import { Tab, Tabs } from "../browser/src/UI/components/Tabs"

describe("<Tabs /> Tests", () => {
    FileIcon.mockImplementation(() => ({ render: jest.fn() }))
    Sneakable.mockImplementation((props) => ({
        render: () => props.children,
    }))

    const tabCloseFunction = jest.fn()
    const tabSelectFunction = jest.fn()

    const tab1 = {
        id: 1,
        name: "test",
        description: "a test tab",
        isSelected: true,
        isDirty: true,
        iconFileName: "icon",
        highlightColor: "#000",
    }

    const tab2 = {
        id: 2,
        name: "test",
        description: "a test tab",
        isSelected: false,
        isDirty: true,
        iconFileName: "icon",
        highlightColor: "#000",
    }

    const TabsContainingSingleTab = (
        <Tabs
            fontSize="1.2em"
            maxWidth="20em"
            height="2em"
            fontFamily="inherit"
            backgroundColor="#fff"
            foregroundColor="#000"
            shouldWrap={false}
            visible={true}
            onTabClose={tabCloseFunction}
            onTabSelect={tabSelectFunction}
            tabs={[tab1]}
        />
    )

    const TabsContainingTwoTabs = (
        <Tabs
            fontSize="1.2em"
            maxWidth="20em"
            height="2em"
            fontFamily="inherit"
            backgroundColor="#fff"
            foregroundColor="#000"
            shouldWrap={false}
            visible={true}
            onTabClose={tabCloseFunction}
            onTabSelect={tabSelectFunction}
            tabs={[tab1, tab2]}
        />
    )

    const TabsNotVisible = (
        <Tabs
            fontSize="1.2em"
            maxWidth="20em"
            height="2em"
            fontFamily="inherit"
            backgroundColor="#fff"
            foregroundColor="#000"
            shouldWrap={false}
            visible={false}
            tabs={[tab1]}
        />
    )

    afterEach(() => {
        tabCloseFunction.mockReset()
        tabSelectFunction.mockReset()
    })

    it("renders without crashing", () => {
        const wrapper = shallow(TabsContainingSingleTab)
        expect(wrapper.length).toEqual(1)
    })

    it("should match last known snapshot unless we make a change", () => {
        const wrapper = shallow(TabsContainingSingleTab)
        expect(shallowToJson(wrapper)).toMatchSnapshot()
    })

    it("should render the correct number of tabs", () => {
        expect(shallow(TabsContainingSingleTab).children().length).toEqual(1)
        expect(shallow(TabsContainingTwoTabs).children().length).toEqual(2)
    })

    it("should not render if the visible prop is false", () => {
        const wrapper = shallow(TabsNotVisible)
        expect(wrapper.getElement()).toBe(null)
    })

    it("should call onTabClose callback on tab close button click", () => {
        const wrapper = mount(TabsContainingSingleTab)
        const clickedTab = wrapper.find(Tab)

        wrapper
            .find(".corner")
            .last()
            .simulate("click")

        expect(tabCloseFunction).toHaveBeenCalledWith(clickedTab.props().id)

        wrapper.unmount()
    })

    it("should call onTabSelect callback on tab title click", () => {
        const wrapper = mount(TabsContainingTwoTabs)
        const clickedTab = wrapper.find(Tab).last()

        clickedTab.find(".name").simulate("mouseDown", { button: 0 })
        expect(tabSelectFunction).toHaveBeenCalledWith(clickedTab.props().id)

        wrapper.unmount()
    })

    it("should call onTabClose callback on tab title middle click", () => {
        const wrapper = mount(TabsContainingTwoTabs)
        const clickedTab = wrapper.find(Tab).first()

        clickedTab.find(".name").simulate("mouseDown", { button: 1 })
        expect(tabCloseFunction).toHaveBeenCalledWith(clickedTab.props().id)

        wrapper.unmount()
    })

    it("should call onTabSelect callback on tab file icon click", () => {
        const wrapper = mount(TabsContainingTwoTabs)
        const clickedTab = wrapper.find(Tab).last()

        clickedTab
            .find(".corner")
            .first()
            .simulate("mouseDown", { button: 0 })
        expect(tabSelectFunction).toHaveBeenCalledWith(clickedTab.props().id)

        wrapper.unmount()
    })

    it("should call onTabClose callback on tab file icon middle click", () => {
        const wrapper = mount(TabsContainingTwoTabs)
        const clickedTab = wrapper.find(Tab).first()

        clickedTab
            .find(".corner")
            .first()
            .simulate("mouseDown", { button: 1 })
        expect(tabCloseFunction).toHaveBeenCalledWith(clickedTab.props().id)

        wrapper.unmount()
    })

    it("should pass tab name as Sneakable tag property", () => {
        const wrapper = mount(TabsContainingSingleTab)
        const tab = wrapper.find(Tab)
        const sneakable = wrapper.find(Sneakable)

        expect(sneakable.props().tag).toEqual(tab.props().name)

        wrapper.unmount()
    });

    it("should call onTabSelect callback as Sneakable callback", () => {
        Sneakable.mockImplementationOnce((props) => {
            props.callback()
        }

        const wrapper = mount(TabsContainingSingleTab)
        const sneakableTab = wrapper.find(Tab)

        expect(tabSelectFunction).toHaveBeenCalledWith(sneakableTab.props().id)

        wrapper.unmount()
    });

    it("should pass tab icon file name as FileIcon fileName property ", () => {
        const wrapper = mount(TabsContainingSingleTab)
        const tab = wrapper.find(Tab)
        const fileIcon = wrapper.find(FileIcon)

        expect(fileIcon.props().fileName).toEqual(tab.props().iconFileName)

        wrapper.unmount()
    });
})
