extern crate proc_macro;
use proc_macro::TokenStream;

struct GraphQLTest {
    input_file: String,
    validation_file: String,
}

#[proc_macro]
fn graphql_test(input: TokenStream) -> TokenStream {}
