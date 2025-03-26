---
date: '2025-03-22'
draft: false
title: 'Mastering Python Decorators: A Practical Guide'
params:
  author: Shubham
summary: ''
tags: ["python", "decorators"]
categories: ["programming"]
---

![](https://cdn-images-1.medium.com/max/800/1*qcCumGkylxKlUFdhpSrGjg.png)

### Introduction

As Python developers, we’re always searching for ways to write more efficient, clean, and maintainable code. Enter decorators — a powerful Python feature that allows you to modify or enhance functions without changing their core implementation. In this article, we’ll dive deep into decorators through a real-world performance monitoring example.

### What Are Decorators?

At its core, a decorator is a function that takes another function as an input and extends or modifies its behaviour. Think of it like a wrapper that can add functionality to existing code without modifying the original function.

### Building a Performance Timer Decorator

Let’s create a practical decorator that measures the execution time of functions — a critical tool for performance optimisation.

```
import time
import functools
import random

def timer_decorator(func):
    """
    A decorator that measures and logs the execution time of a function.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # Record the start time
        start_time = time.time()

        # Execute the original function
        result = func(*args, **kwargs)

        # Calculate and log execution time
        end_time = time.time()
        print(f"Function '{func.__name__}' took {end_time - start_time:.4f} seconds")

        return result
    return wrapper

# Real-World Application Examples
@timer_decorator
def slow_function():
    """
    Simulate a time-consuming task by using sleep
    """
    time.sleep(2)
    print("Slow function completed")

@timer_decorator
def process_large_dataset(size=100000):
    """
    Simulate processing a large dataset with sorting and filtering
    """
    # Generate a large list of random numbers
    data = [random.randint(1, 1000000) for _ in range(size)]

    # Perform some expensive operations
    sorted_data = sorted(data)
    filtered_data = [x for x in sorted_data if x % 2 == 0]

    return filtered_data

def main():
    # Demonstrate the timer decorator
    print("Timing a slow function:")
    slow_function()

    print("\nTiming a data processing function:")
    result = process_large_dataset()
    print(f"Processed {len(result)} even numbers")

if __name__ == "__main__":
    main()
```

### How the Decorator Works

1.  The `timer_decorator` wraps the original function
2.  It records the start time before executing the function
3.  Runs the original function
4.  Calculates and prints the execution time
5.  Returns the original function’s result

### Best Practices

1.  Always use `**@functools.wraps**` to preserve function metadata
2.  Handle potential exceptions in your decorators
3.  Keep decorators focused on a single responsibility
4.  Use type hints for better readability and type checking

### Conclusion

Decorators are a powerful Python feature that allows you to add functionality to functions seamlessly. By understanding and applying decorators, you can write more modular, maintainable, and insightful code.

**Happy Coding! 🐍✨**