import React from 'react';
import { faker } from '@faker-js/faker';
import { Datagrid } from '@resk/native';
export function DatagridExample({ count, ...props }) {
    const data = React.useMemo(() => {
        count = typeof count == 'number' && count > 5 ? count : 10000;
        return faker.helpers.multiple(createRandomUser, {
            count,
        }).map((u, index) => {
            (u as any).userId = String("user-" + (index + 1));
            return u;
        });
    }, [count]);
    return <Datagrid
        actionsProps={{
            title: "Utilisateurs",
        }}
        sessionName="datagrid-test-data"
        rowKey={"userId"}
        columns={[
            {
                type: "number",
                name: "userId",
                label: "Id",
                width: 100,
            },
            {
                label: "Name",
                width: 220,
                name: "username",
                type: "text",
            },
            {
                type: "number",
                label: "Amount",
                name: "amount",
            },
            {
                type: "email",
                label: 'Email',
                name: "email",
            },
            {
                label: 'Avatar',
                name: "avatar",
                type: "text",
                //size: 120,
            },
            {
                type: "date",
                label: "Date",
                name: "birthdate",
            },
        ]}
        data={data}
        {...props}
    />
}

export function createRandomUser() {
    return {
        userId: faker.number.int,
        username: faker.internet.username(),
        amount: faker.number.int(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
    };
}
