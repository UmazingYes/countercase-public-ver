#include <bits/stdc++.h>
using namespace std;

#include "../puzzle.hpp"

class BrokenBinarySearch : public Puzzle
{
public:
    void validate(const string &input) override
    {
        stringstream ss(input);

        int n;
        int x;

        if (!(ss >> n >> x))
            throw runtime_error("Invalid input. Expected n and x.");

        if (n < 1 || n > 100)
            throw runtime_error("n must be between 1 and 100.");

        vector<int> a(n);

        for (int i = 0; i < n; i++)
        {
            if (!(ss >> a[i]))
                throw runtime_error("Missing array element.");
        }

        for (int i = 1; i < n; i++)
        {
            if (a[i] < a[i - 1])
                throw runtime_error("Array must be sorted in nondecreasing order.");
        }

        string extra;
        if (ss >> extra)
            throw runtime_error("Too much input.");
    }

    string wrong(const string &input) override
    {
        stringstream ss(input);

        int n;
        int x;
        ss >> n >> x;

        vector<int> a(n);

        for (int i = 0; i < n; i++)
            ss >> a[i];

        int l = 0;
        int r = n - 1;

        while (l < r)
        {
            int mid = (l + r) / 2;

            if (a[mid] < x)
                l = mid + 1;
            else
                r = mid - 1;
        }

        return a[l] == x ? "1" : "0";
    }

    string correct(const string &input) override
    {
        stringstream ss(input);

        int n;
        int x;
        ss >> n >> x;

        vector<int> a(n);

        for (int i = 0; i < n; i++)
            ss >> a[i];

        return binary_search(a.begin(), a.end(), x) ? "1" : "0";
    }
};

unique_ptr<Puzzle> make_broken_binary_search()
{
    return make_unique<BrokenBinarySearch>();
}