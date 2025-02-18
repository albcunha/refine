import React, { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { AccessControlProvider } from "@pankod/refine-core";
import { Table } from "antd";

import { act, render, TestWrapper, waitFor } from "@test";
import { List } from "./index";

const renderList = (
    list: ReactNode,
    accessControlProvider?: AccessControlProvider,
) => {
    return render(
        <Routes>
            <Route path="/:resource" element={list} />
        </Routes>,
        {
            wrapper: TestWrapper({
                routerInitialEntries: ["/posts"],
                accessControlProvider,
            }),
        },
    );
};

describe("<List/>", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    describe("JSON Rest Server", () => {
        it("mounts with table", async () => {
            const { getByText } = renderList(
                <List key="posts">
                    <Table rowKey="id" />
                </List>,
            );

            await act(async () => {
                jest.advanceTimersToNextTimer(1);
            });

            getByText("No Data");
        });
        it("renders given data", async () => {
            const { container } = renderList(
                <List key="posts">
                    <Table rowKey="id">
                        <Table.Column
                            key="title"
                            title="Title"
                            dataIndex="title"
                        />
                    </Table>
                </List>,
            );

            await act(async () => {
                jest.advanceTimersToNextTimer(1);
            });

            expect(container).toMatchSnapshot();
        });

        it("should render optional title with title prop", async () => {
            const { getByText } = renderList(<List title="New Title"></List>);

            await act(async () => {
                jest.advanceTimersToNextTimer(1);
            });

            getByText("New Title");
        });

        it("should render with label instead of resource name successfully", async () => {
            const { getByText } = render(
                <Routes>
                    <Route path="/:resource" element={<List />} />
                </Routes>,
                {
                    wrapper: TestWrapper({
                        resources: [
                            {
                                name: "posts",
                                options: { route: "posts", label: "test" },
                            },
                        ],
                        routerInitialEntries: ["/posts"],
                    }),
                },
            );

            await act(async () => {
                jest.advanceTimersToNextTimer(1);
            });

            getByText("Tests");
        });

        describe("render create button", () => {
            it("should create edit button", async () => {
                const { getByText, queryByTestId } = render(
                    <Routes>
                        <Route path="/:resource" element={<List />} />
                    </Routes>,
                    {
                        wrapper: TestWrapper({
                            resources: [
                                {
                                    name: "posts",
                                    create: () => null,
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                await act(async () => {
                    jest.advanceTimersToNextTimer(1);
                });

                expect(queryByTestId("list-create-button")).not.toBeNull();

                getByText("Posts");
            });

            it("should not render create button on resource canCreate false", async () => {
                const { getByText, queryByTestId } = render(
                    <Routes>
                        <Route path="/:resource" element={<List />} />
                    </Routes>,
                    {
                        wrapper: TestWrapper({
                            resources: [
                                {
                                    name: "posts",
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                await act(async () => {
                    jest.advanceTimersToNextTimer(1);
                });

                expect(queryByTestId("list-create-button")).toBeNull();

                getByText("Posts");
            });

            it("should render create button on resource canCreate false & createButtonProps props not null on component", async () => {
                const { getByText, queryByTestId } = render(
                    <Routes>
                        <Route
                            path="/:resource"
                            element={
                                <List createButtonProps={{ size: "large" }} />
                            }
                        ></Route>
                    </Routes>,
                    {
                        wrapper: TestWrapper({
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                await act(async () => {
                    jest.advanceTimersToNextTimer(1);
                });

                expect(queryByTestId("list-create-button")).not.toBeNull();

                getByText("Posts");
            });

            it("should render create button on resource canCreate true & createButtonProps props not null on component", async () => {
                const { getByText, queryByTestId } = render(
                    <Routes>
                        <Route
                            path="/:resource"
                            element={
                                <List createButtonProps={{ size: "large" }} />
                            }
                        ></Route>
                    </Routes>,
                    {
                        wrapper: TestWrapper({
                            resources: [
                                {
                                    name: "posts",
                                    create: () => null,
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                await act(async () => {
                    jest.advanceTimersToNextTimer(1);
                });

                expect(queryByTestId("list-create-button")).not.toBeNull();

                getByText("Posts");
            });

            it("should not render create button on resource canCreate true & canCreate props false on component", async () => {
                const { queryByTestId } = render(
                    <Routes>
                        <Route
                            path="/:resource"
                            element={<List canCreate={false} />}
                        ></Route>
                    </Routes>,
                    {
                        wrapper: TestWrapper({
                            resources: [
                                {
                                    name: "posts",
                                    create: () => null,
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                await act(async () => {
                    jest.advanceTimersToNextTimer(1);
                });

                expect(queryByTestId("list-create-button")).toBeNull();
            });

            it("should render create button on resource canCreate false & canCreate props true on component", async () => {
                const { queryByTestId } = render(
                    <Routes>
                        <Route
                            path="/:resource"
                            element={<List canCreate={true} />}
                        ></Route>
                    </Routes>,
                    {
                        wrapper: TestWrapper({
                            resources: [
                                {
                                    name: "posts",
                                },
                            ],
                            routerInitialEntries: ["/posts"],
                        }),
                    },
                );

                await act(async () => {
                    jest.advanceTimersToNextTimer(1);
                });

                expect(queryByTestId("list-create-button")).not.toBeNull();
            });

            it("should render disabled create button if user doesn't have permission", async () => {
                const { queryByTestId } = renderList(
                    <List canCreate={true} />,
                    {
                        can: ({ action }) => {
                            switch (action) {
                                case "create":
                                    return Promise.resolve({ can: false });
                                default:
                                    return Promise.resolve({ can: false });
                            }
                        },
                    },
                );

                await act(async () => {
                    jest.advanceTimersToNextTimer(1);
                });

                expect(queryByTestId("list-create-button")).toBeDisabled();
            });
        });
    });
});
