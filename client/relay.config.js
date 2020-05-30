module.exports = {
    src: "./src",
    schema: "./schema.graphql",
    artifactDirectory: "./src/__generated__",
    customScalars: {
        Datetime: "string",
        Color: "Color.t",
    },
};