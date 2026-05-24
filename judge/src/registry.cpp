#include "registry.hpp"

#include <stdexcept>

std::unique_ptr<Puzzle> make_broken_binary_search();

std::unique_ptr<Puzzle> make_puzzle(const std::string &slug)
{
    if (slug == "broken-binary-search")
        return make_broken_binary_search();

    throw std::runtime_error("unknown puzzle");
}
