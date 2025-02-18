---
id: clone-button
title: Clone
---

import cloneButton from '@site/static/img/guides-and-concepts/components/buttons/clone/clone-mui.png';

`<CloneButton>` Material UI [`<Button>`](https://mui.com/material-ui/react-button/) component. It uses the `clone` method from [useNavigation](/core/hooks/navigation/useNavigation.md) under the hood.
It can be useful when redirecting the app to the create page with the record id route of resource.

## Usage

```tsx
import { useTable } from "@pankod/refine-core";

import {
    List,
    Table,
    // highlight-next-line
    CloneButton,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@pankod/refine-mui";

export const PostList: React.FC = () => {
    const { tableQueryResult } = useTable<IPost>();

    const { data } = tableQueryResult;

    return (
        <List>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell align="center">
                                // highlight-next-line
                                <CloneButton recordItemId={row.id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </List>
    );
};

interface IPost {
    id: number;
    title: string;
}
```

Will look like this:

<div class="img-container">
    <div class="window">
        <div class="control red"></div>
        <div class="control orange"></div>
        <div class="control green"></div>
    </div>
    <img src={cloneButton} alt="Default clone button" />
</div>

## Properties

### `recordItemId`

`recordItemId` is used to append the record id to the end of the route path.

```tsx
import { CloneButton } from "@pankod/refine-mui";

export const MyCloneComponent = () => {
    return <CloneButton resourceNameOrRouteName="posts" recordItemId="1" />;
};
```

Clicking the button will trigger the `clone` method of [`useNavigation`](/core/hooks/navigation/useNavigation.md) and then redirect the app to `/posts/clone/1`.

:::note
**`<CloneButton>`** component reads the id information from the route by default.
:::

### `resourceNameOrRouteName`

It is used to redirect the app to the `/clone` endpoint of the given resource name. By default, the app redirects to a URL with `/clone` defined by the name property of the resource object.

```tsx
import { CloneButton } from "@pankod/refine-mui";

export const MyCloneComponent = () => {
    return (
        <CloneButton resourceNameOrRouteName="categories" recordItemId="2" />
    );
};
```

Clicking the button will trigger the `clone` method of [`useNavigation`](/core/hooks/navigation/useNavigation.md) and then redirect the app to `/categories/clone/2`.

### `hideText`

It is used to show and not show the text of the button. When `true`, only the button icon is visible.

```tsx
import { CloneButton } from "@pankod/refine-mui";

export const MyCloneComponent = () => {
    return <CloneButton hideText />;
};
```

### `ignoreAccessControlProvider`

It is used to skip access control for the button so that it doesn't check for access control. This is relevant only when an [`accessControlProvider`](/core/providers/accessControl-provider.md) is provided to [`<Refine/>`](/core/components/refine-config.md)

```tsx
import { CloneButton } from "@pankod/refine-mui";

export const MyCloneComponent = () => {
    return <CloneButton ignoreAccessControlProvider />;
};
```

## API Reference

| Property                    | Description                                      | Type                                                              | Default                                                                                                                       |
| --------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| props                       | Material UI button props                         | [`ButtonProps`](https://mui.com/material-ui/api/button/)          |                                                                                                                               |
| resourceNameOrRouteName     | Determines which resource to use for redirection | `string`                                                          | Resource name that it reads from route                                                                                        |
| recordItemId                | Adds `id` to the end of the URL                  | [`BaseKey`](/core/interfaces.md#basekey)                          | Record id that it reads from route                                                                                            |
| hideText                    | Allows to hide button text                       | `boolean`                                                         | `false`                                                                                                                       |
| ignoreAccessControlProvider | Skip access control                              | `boolean`                                                         | `false`                                                                                                                       |
| children                    | Sets the button text                             | `ReactNode`                                                       | `"Clone"`                                                                                                                     |
| startIcon                   | Sets the icon component of button                | `ReactNode`                                                       | [`<AddBoxOutlinedIcon />`](https://mui.com/material-ui/material-icons/?query=add+box&theme=Outlined&selected=AddBoxOutlined/) |
| svgIconProps                | Allows to set icon props                         | [`SvgIconProps`](https://mui.com/material-ui/api/svg-icon/#props) |                                                                                                                               |
| onClick                     | Sets the handler to handle click event           | `(event) => void`                                                 | Triggers navigation for redirection to the create page of resource                                                            |
