#[macro_use]
extern crate diesel;

use pyo3::prelude::*;

mod server;
mod db;

#[pyclass]
pub struct PerformantWebsockets {}

#[pymethods]
impl PerformantWebsockets {
    #[new]
    pub fn new() -> Self {
        Self {}
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
