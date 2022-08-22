<template>
  <component
    :is="wrapper"
    :class="['select', state, dir, disabled ? 'disabled' : '']"
  >
    <!-- The select UI. -->
    <div class="select__ui">
      <div
        @click="toggleOptions()"
        ref="select"
        :class="[
          'select__toggle',
          disabled,
          { selectedDisabled: !optionSelected.label && placeholder },
        ]"
      >
        {{ optionSelected.label ? optionSelected.label : placeholder }}
        <Icon class="select__caret" name="arrow-down" />
      </div>

      <ul class="select__options" v-if="optionsVisible">
        <li
          v-for="(optionValue, optionLabel) in options"
          :key="optionValue"
          @click="updateOption(optionLabel, optionValue, $event)"
        >
          {{ optionLabel }}
        </li>
      </ul>
    </div>

    <!-- The hidden select HTML element. -->
    <select
      :id="id"
      :name="name"
      :form="formId"
      :multiple="multiple"
      :disabled="disabled"
      :required="required"
      :autofocus="autofocus"
      @input="updateValue($event, 'input')"
      @change="updateValue($event, 'change')"
      @focus="updateValue($event, 'focus')"
      @blur="updateValue($event, 'blur')"
      @keyup="updateValue($event, 'keyup')"
    >
      <option :value="optionSelected.value" selected>
        {{ optionSelected.label }}
      </option>
    </select>

    <!-- Field Info. -->
    <FieldInfo
      :description="description"
      :state="state"
      :error="error.message"
      :info="info"
    />
  </component>
</template>

<script lang="ts">
import { ref, watch } from "vue";
import { computed } from "vue";
import { reactive } from "vue";
import { onMounted } from "vue";
/**
 * This is my amazing counter component
 *
 * It can increment and decrement!
 */
export default {
  props: {
    /**
     * The options to be loaded.
     * `label:value`<br>
     * example:
     * {
     *  "label1": "value1",
     *  "label2": "value2",
     * }
     */
    options: {
      type: [Array, Object],
    },
    /**
     * The current field value.
     */
    value: {
      type: [String, Number],
      default: "",
    },
    /**
     * The placeholder when no option is selected.
     */
    placeholder: {
      type: String,
      default: "",
    },
    /**
     * Unique identifier of the form select field.
     */
    id: {
      type: String,
      default: null,
    },
    /**
     * Name of the form select field.
     */
    name: {
      type: String,
      default: null,
    },
    /**
     * Id of the form this select field applies to.
     */ formId: {
      type: String,
      default: null,
    },
    /**
     * The label of the form select field.
     */
    label: {
      type: String,
      default: null,
    },
    /**
     * The description of the form select field.
     */
    description: {
      type: String,
      default: null,
    },
    /**
     * The html element name used for the wrapper.
     * `div, section`
     */
    wrapper: {
      type: String,
      default: "div",
      validator: (value) => {
        return value.match(/(div|section)/);
      },
    },
    /**
     * Whether the form select field is disabled or not.
     * `true, false`
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether the form select field is required or not.
     * `true, false`
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether the form select field is autofocused.
     * `true, false`
     */
    autofocus: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether the form select accepts multiple values.
     * `true, false`
     *
     * @todo setup multiple value select.
     */
    multiple: {
      type: Boolean,
      default: false,
    },
    /**
     * Manually trigger various states of the select.
     * `active, error, info`
     */
    state: {
      type: String,
      default: null,
      validator: (value) => {
        return value.match(/(active|error|info)/);
      },
    },
    /**
     * The name of the icon.
     * See Icon in design system for list.
     */
    icon: {
      type: String,
      default: null,
    },
    /**
     * The error message.
     */
    errorMessage: {
      type: String,
      default: null,
    },
    /**
     * The info message.
     */
    info: {
      type: String,
      default: null,
    },
    /**
     * The display direction.
     * `ltr, rtl`
     */
    dir: {
      type: String,
      default: "ltr",
      validator: (value) => {
        return value.match(/(ltr|rtl)/);
      },
    },
  },
  emits: ["updateOption"],
  setup(props, context) {
    const optionSelected = reactive({
      label: "",
      value: "",
    });
    const value = ref(props.value);
    const select = ref(null);
    const options = reactive(props.options);
    const optionsVisible = ref(false);
    const error = computed(() => ({ message: props.errorMessage }));

    /** Triggers during user input select update.
     * @event input
     * @type {Event}
     */
    function updateOption(optionLabel, optionValue, event) {
      optionSelected.label = optionLabel;
      optionSelected.value = optionValue;
      optionsVisible.value = false;
      context.emit("updateOption", optionSelected);
      updateValue(event, "input");
    }
    /** Triggers when an option is selected.
     * @event input
     * @type {Event}
     */
    function updateValue(event, type) {
      changeHandler(optionSelected.value, type, event);
    }
    /** Triggers during user input and  emit value.
     * @event input
     * @type {Event}
     */
    function changeHandler(value, type, event) {
      const emit = type !== undefined && type.length > 0 ? type : "input";
      context.emit(emit, value, event);
    }
    function toggleOptions() {
      optionsVisible.value = !optionsVisible.value;
    }
    function documentClick(event) {
      const el = select;
      const { target } = event;
      if (el !== target && !el.contains(target)) {
        optionsVisible.value = false;
      }
    }

    onMounted(() => {
      if (value.value) {
        const optionLabel = Object.keys(options).find(
          (key) => options[key] === value.value
        );
        updateOption(optionLabel, value.value, "change");
      }
    });
    watch(value, (newValue) => {
      const optionLabel = Object.keys(options).find(
        (key) => options[key] === value.value
      );
      updateOption(optionLabel, newValue, "change");
    });

    return {
      optionSelected,
      optionsVisible,
      error,
      updateOption,
      changeHandler,
      updateValue,
      toggleOptions,
      documentClick,
      select,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/colors";
.select__caret {
  margin-top: 2px;
  position: absolute;
}

.select__toggle,
.select__options {
  box-sizing: border-box;
  cursor: pointer;
  font-family: $type-font;
  font-size: $type-size-body;
  line-height: 1.15em;
  width: 100%;
}

.select__toggle {
  align-items: center;
  background-color: $color-white;
  border: 1px solid $color-disabled;
  border-radius: $radius-sm;
  color: $color-black;
  display: block;
  margin-bottom: $space-xs;
  max-width: 100%;
  min-height: 50px;
  outline: 0;
  overflow: hidden;
  padding: 13px $space-md 13px $space-xs;
  text-overflow: ellipsis;
  text-transform: none;
  white-space: nowrap;

  &.disabled {
    background: $color-lightest;
    color: $color-disabled;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.select__options {
  background-color: $color-white;
  border: 0;
  border-radius: $radius-sm;
  box-shadow: $shadow-md;
  list-style: none;
  margin: 0;
  max-height: 400px;
  overflow: auto;
  padding: 0;
  position: absolute;
  top: 46px + $space-xxs;
  z-index: 10;

  li {
    font-size: $type-size-body;
    line-height: $type-size-lead;
    list-style: none;
    margin: 0;
    overflow: hidden;
    padding: $space-xs;
    position: relative;
  }

  li:hover {
    background-color: $color-lightest;
  }

  li:first-child:hover {
    border-top-left-radius: $radius-sm;
    border-top-right-radius: $radius-sm;
  }

  li:last-child:hover {
    border-bottom-left-radius: $radius-sm;
    border-bottom-right-radius: $radius-sm;
  }
}

.select {
  height: 100%;
  margin-bottom: $space-sm;
  position: relative;

  select {
    display: none;
  }

  &.disabled {
    cursor: not-allowed;

    .select__ui,
    .select__toggle {
      background: $color-lightest;
      color: $color-disabled;
      pointer-events: none;
    }
  }

  // States.
  &.error {
    .select__toggle {
      border-color: $color-red;
    }
  }

  // Direction
  &.ltr {
    .select__caret {
      right: $space-xs;
    }

    .select__options {
      text-align: left;
    }
  }

  &.rtl {
    direction: rtl;

    .select__caret {
      left: $space-xs;
    }

    .select__toggle {
      padding: 13px $space-xs 13px $space-md;
    }

    .select__options {
      text-align: right;
    }
  }
}
</style>
