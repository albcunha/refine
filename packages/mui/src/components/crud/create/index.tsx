import React from "react";

import {
    useNavigation,
    useResourceWithRoute,
    useRouterContext,
    useTranslate,
    userFriendlyResourceName,
    ResourceRouterParams,
} from "@pankod/refine-core";

import {
    Card,
    CardHeader,
    CardActions,
    ButtonProps,
    CardContent,
    IconButton,
    CardProps,
    CardHeaderProps,
    CardContentProps,
    CardActionsProps,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Breadcrumb, SaveButton } from "@components";

export interface CreateProps {
    actionButtons?: React.ReactNode;
    saveButtonProps?: ButtonProps;
    resource?: string;
    isLoading?: boolean;
    cardProps?: CardProps;
    cardHeaderProps?: CardHeaderProps;
    cardContentProps?: CardContentProps;
    cardActionsProps?: CardActionsProps;
    breadcrumb?: React.ReactNode;
}

/**
 * `<Create>` provides us a layout to display the page.
 * It does not contain any logic but adds extra functionalities like action buttons and giving titles to the page.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/mui/components/basic-views/create} for more details.
 */
export const Create: React.FC<CreateProps> = ({
    actionButtons,
    children,
    saveButtonProps,
    resource: resourceFromProps,
    isLoading = false,
    cardProps,
    cardHeaderProps,
    cardContentProps,
    cardActionsProps,
    breadcrumb = <Breadcrumb />,
}) => {
    const { goBack } = useNavigation();

    const translate = useTranslate();

    const { useParams } = useRouterContext();

    const { resource: routeResourceName, action: routeFromAction } =
        useParams<ResourceRouterParams>();

    const resourceWithRoute = useResourceWithRoute();

    const resource = resourceWithRoute(resourceFromProps ?? routeResourceName);

    return (
        <Card {...cardProps}>
            {breadcrumb}
            <CardHeader
                sx={{ display: "flex", flexWrap: "wrap" }}
                title={
                    <Typography variant="h5">
                        {translate(
                            `${resource.name}.titles.create`,
                            `Create ${userFriendlyResourceName(
                                resource.label ?? resource.name,
                                "singular",
                            )}`,
                        )}
                    </Typography>
                }
                avatar={
                    <IconButton onClick={routeFromAction ? goBack : undefined}>
                        <ArrowBackIcon />
                    </IconButton>
                }
                {...cardHeaderProps}
            />
            <CardContent {...cardContentProps}>{children}</CardContent>
            <CardActions
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                    padding: "16px",
                }}
                {...cardActionsProps}
            >
                {actionButtons ?? (
                    <SaveButton loading={isLoading} {...saveButtonProps} />
                )}
            </CardActions>
        </Card>
    );
};
