import MySelect from '../components/MySelect.vue'

interface Story {
    (): any
    args?: any // Optional since args is defined after function declaration
}

//👇 This default export determines where your story goes in the story list
export default {
    title: 'MySelect',
    component: MySelect,
    //👇 Creates specific argTypes with options
    argTypes: {
        options: {}
    },
}

//👇 We create a “template” of how args map to rendering
const Template = (args: unknown) => ({
    components: { MySelect },
    setup() {
        //👇 The args will now be passed down to the template
        return { args }
    },
    template: '<MySelect v-bind="args"/>',
})

//👇 Each story then reuses that template
export const Default = Template.bind({}) as Story
Default.args = {
    options: { 'This': 'this', 'That': 'that' },
    placeholder: 'select',
    multiple: false
}

export const RTL = Template.bind({}) as Story
RTL.args = {
    options: { 'يناير': ' يناير', 'فبراير': 'فبراير' },
    dir: "rtl",
    placeholder: 'الشهر'
}

