import BankContent from "./index";
import { Meta, StoryFn } from "@storybook/react";

export default {
  title: "atoms/Form/BankContent",
  component: BankContent,
} as Meta;

const Template: StoryFn = () => (
  <BankContent
    setBankName={() => {
      return;
    }}
    setIsBottomSheetOpen={() => {
      return;
    }}
  />
);

export const Default = Template.bind({});
Default.args = {};
