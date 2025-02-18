import { useCallback, useContext } from "react";
import { useMutation, UseMutationResult, useQueryClient } from "react-query";

import { AuditLogContext } from "@contexts/auditLog";
import { ResourceContext } from "@contexts/resource";
import { useGetIdentity } from "@hooks/auth";
import { BaseKey, LogParams } from "../../../interfaces";
import { hasPermission, queryKeys } from "@definitions/helpers";

type LogRenameData =
    | {
          resource?: string;
      }
    | undefined;
export type UseLogReturnType<TLogRenameData> = {
    log: (params: LogParams) => Promise<void>;
    rename: UseMutationResult<
        TLogRenameData,
        Error,
        {
            id: BaseKey;
            name: string;
        }
    >;
};

export const useLog = <
    TLogRenameData extends LogRenameData = LogRenameData,
>(): UseLogReturnType<TLogRenameData> => {
    const queryClient = useQueryClient();
    const auditLogContext = useContext(AuditLogContext);

    const { resources } = useContext(ResourceContext);
    const {
        data: identityData,
        refetch,
        isLoading,
    } = useGetIdentity({
        queryOptions: {
            enabled: !!auditLogContext,
        },
    });

    const log = useCallback(
        async (params: LogParams) => {
            const resource = resources.find((p) => p.name === params.resource);
            const logPermissions = resource?.options?.auditLog?.permissions;

            if (logPermissions) {
                const shouldLog = hasPermission(logPermissions, params.action);

                if (shouldLog) {
                    let authorData;
                    if (isLoading) {
                        authorData = await refetch();
                    }

                    auditLogContext.create?.({
                        ...params,
                        author: identityData ?? authorData?.data,
                    });
                }
            }
        },
        [resources, identityData, auditLogContext],
    );

    const rename = useMutation<
        TLogRenameData,
        Error,
        { id: BaseKey; name: string },
        unknown
    >(
        async (params) => {
            return await auditLogContext.update?.(params);
        },
        {
            onSuccess: (data) => {
                if (data?.resource) {
                    const queryKey = queryKeys(data?.resource);
                    queryClient.invalidateQueries(queryKey.logList());
                }
            },
        },
    );

    return { log, rename };
};
