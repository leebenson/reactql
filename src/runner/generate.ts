import { CLIOptions, generate } from "graphql-code-generator";
import { join } from "path";

export const generateSchemaTypings = async (watch: boolean = false) => {
  const operationsFiles = ["./src/{queries,mutations}/*.{ts,tsx,graphql,gql}"];
  const templates = [{
    out: join(process.cwd(), "./src/graphql/graphql-types.tsx"),
    template: "graphql-codegen-typescript-react-apollo-template",
  }, {
    out: join(process.cwd(), "./src/graphql/graphql-modules.d.ts"),
    template: "graphql-codegen-graphql-files-typescript-modules",
  }];
  const clientSchema = "./src/graphql/client-schema.graphql";
  const remoteSchema = process.env.GRAPHQL;
  let baseOptions: Partial<CLIOptions>;

  process.env.CODEGEN_RESOLVERS = "false";

  if (remoteSchema) {
    baseOptions = {
      args: operationsFiles,
      clientSchema,
      overwrite: true,
      schema: remoteSchema,
      watch,
    };
  } else {
    baseOptions = {
      args: operationsFiles,
      overwrite: true,
      schema: clientSchema,
      watch,
    };
  }

  return Promise.all(templates.map(template => generate({ ...template , ...baseOptions })));
};
