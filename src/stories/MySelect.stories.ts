import MySelect from '../components/MySelect.vue'

interface Story {
    (): any
    args?: any // Optional since args is defined after function declaration
}

//๐ This default export determines where your story goes in the story list
export default {
    title: 'MySelect',
    component: MySelect,
    //๐ Creates specific argTypes with options
    argTypes: {
        options: {}
    },
}

//๐ We create a โtemplateโ of how args map to rendering
const Template = (args: unknown) => ({
    components: { MySelect },
    setup() {
        //๐ The args will now be passed down to the template
        return { args }
    },
    template: '<MySelect v-bind="args"/>',
})

//๐ Each story then reuses that template
export const Default = Template.bind({}) as Story
Default.args = {
    options: { 'This': 'this', 'That': 'that' },
    placeholder: 'select',
    multiple: false
}

export const RTL = Template.bind({}) as Story
RTL.args = {
    options: { 'ููุงูุฑ': ' ููุงูุฑ', 'ูุจุฑุงูุฑ': 'ูุจุฑุงูุฑ' },
    dir: "rtl",
    placeholder: 'ุงูุดูุฑ'
}

