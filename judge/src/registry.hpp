#pragma once

#include <memory>
#include <string>

#include "puzzle.hpp"

std::unique_ptr<Puzzle> make_puzzle(const std::string &slug);
