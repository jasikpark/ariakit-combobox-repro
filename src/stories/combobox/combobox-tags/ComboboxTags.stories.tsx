import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";
import { useForm } from "react-hook-form";
// import { sleep } from "@util/sleep";
import { ComboboxTags } from "./ComboboxTags";

const MOCK_TAGS = ["env:production", "env:development", "quality:alpha"];

const meta = {
  title: "select/<ComboboxTags>",
  component: ComboboxTags,
  render: function Render(args) {
    const { control } = useForm<{ tags: string[]; foo: string }>({
      defaultValues: { tags: MOCK_TAGS },
    });

    return (
      <form>
        <ComboboxTags name={args.name} control={control} />
      </form>
    );
  },
  parameters: { chromatic: { disable: false } },
} satisfies Meta<typeof ComboboxTags>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Default",
  args: {
    name: "tags",
  },
};

export const Filtered: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(getByRole("combobox"), "qual");
  },
};

export const TagRemoved: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(getByRole("combobox"), "{backspace}");
  },
};

export const NewTagToCreate: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(getByRole("combobox"), "region:eu-2");
  },
};

/** When a typed value partially matches existing values, add a new `Create X` at the end of the options */
export const NewTagAfterExisting: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(getByRole("combobox"), "env:test");
  },
};

export const NewTagAdded: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(getByRole("combobox"), "region:eu-2");
    await userEvent.keyboard("{enter}");
  },
};

export const NoColon: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(getByRole("combobox"), "new");
  },
};

export const LongKey: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(getByRole("combobox"), "ThisKeyIsMoreThan20Char:long");
  },
};

export const LongValue: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(
      getByRole("combobox"),
      "key:ThisValueIsMoreThan50CharactersLongAndThereforeCannotBeAdded"
    );
  },
};

export const LeadingWhitespace: Story = {
  args: {
    name: "tags",
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.type(getByRole("combobox"), "key : value");
  },
};

export const AllOptionsAdded: Story = {
  args: {
    name: "tags",
  },
  render: function Render(args) {
    const { control } = useForm<{ tags: string[]; foo: string }>({
      defaultValues: { tags: ["env:production"] },
    });

    return (
      <form>
        <ComboboxTags name={args.name} control={control} />
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.click(getByRole("combobox"));
    await userEvent.keyboard("{arrowdown}");
  },
};

/**
 * What is shown when no tags have yet been created on the server
 */
export const NoTagsOnServer: Story = {
  args: {
    name: "tags",
  },
  render: function Render(args) {
    const { control } = useForm<{ tags: string[]; foo: string }>({
      defaultValues: { tags: [] },
    });

    return (
      <form>
        <ComboboxTags name={args.name} control={control} />
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const { getByRole } = within(canvasElement);
    await userEvent.click(getByRole("combobox"));
    await userEvent.keyboard("{arrowdown}");
  },
};
