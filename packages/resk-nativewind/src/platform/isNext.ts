/***
    @group Platform
    Checks if the current environment is a Next.js environment.

    This function use the platform specific extensions to determine if the environment is a Next.js environment.

    @returns {boolean} True if the environment is a Next.js environment, false otherwise.

    @example
    ```typescript
    if (isNextJs()) {
      console.log("We're in a Next.js environment!");
    } else {
      console.log("We're not in a Next.js environment.");
    }
    ```
*/
export const isNextJs = ()=> false;