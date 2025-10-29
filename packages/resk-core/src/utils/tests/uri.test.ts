import {
  extractQueryString,
  getQueryParams,
  isEncodedURIComponent,
  isValidUrl,
  objectToQueryString,
  removeQueryString,
  setQueryParams,
} from "../index";

describe("URI Utils", () => {
  describe("extractQueryString", () => {
    it('should return the query string with a leading "?"', () => {
      const url = "https://example.com/path?a=1&b=2";
      expect(extractQueryString(url)).toBe("?a=1&b=2");
    });

    it('should return the query string without a leading "?"', () => {
      const url = "https://example.com/path?a=1&b=2";
      expect(extractQueryString(url, false)).toBe("a=1&b=2");
    });

    it("should return an empty string for a URL without a query string", () => {
      const url = "https://example.com/path";
      expect(extractQueryString(url)).toBe("");
    });
  });

  describe("getQueryParams", () => {
    it("should return query parameters as an object", () => {
      const url = "https://example.com/path?a=1&b=2&c[]=3&c[]=4";
      expect(getQueryParams(url)).toEqual({ a: "1", b: "2", c: ["3", "4"] });
    });

    it("should return an empty object for a URL without a query string", () => {
      const url = "https://example.com/path";
      expect(getQueryParams(url)).toEqual({});
    });
  });

  describe("removeQueryString", () => {
    it("should remove the query string from a URL", () => {
      const url = "https://example.com/path?a=1&b=2#fragment";
      expect(removeQueryString(url)).toBe("https://example.com/path");
    });

    it("should decode the resulting URL if _decodeURIComponent is true", () => {
      const url = "https://example.com/path%20with%20spaces?a=1&b=2";
      expect(removeQueryString(url, true)).toBe(
        "https://example.com/path with spaces"
      );
    });
  });

  describe("setQueryParams", () => {
    it("should add query parameters to a URL", () => {
      const url = "https://example.com/path";
      expect(setQueryParams(url, "a", 1)).toBe("https://example.com/path?a=1");
      expect(setQueryParams(url, { a: 1, b: 2 })).toBe(
        "https://example.com/path?a=1&b=2"
      );
    });

    it("should merge new query parameters with existing ones", () => {
      const url = "https://example.com/path?a=1";
      expect(setQueryParams(url, "b", 2)).toBe(
        "https://example.com/path?a=1&b=2"
      );
    });
  });

  describe("objectToQueryString", () => {
    it("should convert an object to a query string", () => {
      const obj = { a: 1, b: 2, c: { d: 3, e: 4 } };
      expect(objectToQueryString(obj)).toBe("a=1&b=2&c[d]=3&c[e]=4");
    });

    it("should encode the values if encodeURI is true", () => {
      const obj = { a: "hello world", b: "foo@bar.com" };
      expect(objectToQueryString(obj, true)).toBe(
        "a=hello%20world&b=foo%40bar.com"
      );
    });
  });

  describe("isValidUrl", () => {
    it("should return true for valid URLs", () => {
      expect(isValidUrl("http://example.com")).toBe(true);
      expect(isValidUrl("https://localhost:3000")).toBe(true);
      expect(isValidUrl("ftp://files.example.com")).toBe(true);
    });

    it("should return false for invalid URLs", () => {
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl("not-a-valid-url")).toBe(false);
      expect(isValidUrl("http://256.256.256.256")).toBe(true);
    });
  });

  describe("isEncodedURIComponent", () => {
    describe("Basic encoded strings", () => {
      it("should return true for strings encoded with encodeURIComponent", () => {
        expect(isEncodedURIComponent("hello%20world")).toBe(true);
        expect(isEncodedURIComponent("foo%2Bbar")).toBe(true);
        expect(isEncodedURIComponent("test%3Dvalue")).toBe(true);
        expect(isEncodedURIComponent("path%2Fto%2Ffile")).toBe(true);
        expect(isEncodedURIComponent("query%3Fkey%3Dvalue")).toBe(true);
        expect(isEncodedURIComponent("https%3A%2F%2Fexample.com%2Fpath")).toBe(
          true
        );
        expect(isEncodedURIComponent("user%40example.com")).toBe(true);
      });

      it("should detect encoding of all special characters", () => {
        // Characters that encodeURIComponent encodes
        expect(isEncodedURIComponent("space%20here")).toBe(true);
        expect(isEncodedURIComponent("plus%2Bsign")).toBe(true);
        expect(isEncodedURIComponent("equals%3Dsign")).toBe(true);
        expect(isEncodedURIComponent("ampersand%26symbol")).toBe(true);
        expect(isEncodedURIComponent("hash%23tag")).toBe(true);
        expect(isEncodedURIComponent("question%3Fmark")).toBe(true);
        expect(isEncodedURIComponent("colon%3Asemicolon%3B")).toBe(true);
        expect(isEncodedURIComponent("less%3Cgreater%3E")).toBe(true);
        expect(isEncodedURIComponent("square%5Bbracket%5D")).toBe(true);
        expect(isEncodedURIComponent("curly%7Bbrace%7D")).toBe(true);
        expect(isEncodedURIComponent("pipe%7Csymbol")).toBe(true);
        expect(isEncodedURIComponent("backslash%5Cescape")).toBe(true);
        expect(isEncodedURIComponent("caret%5Ehat")).toBe(true);
        expect(isEncodedURIComponent("backtick%60grave")).toBe(true);
        expect(isEncodedURIComponent("quote%22marks%27")).toBe(true);
      });
    });

    describe("Unencoded strings", () => {
      it("should return false for unencoded strings", () => {
        expect(isEncodedURIComponent("hello world")).toBe(false);
        expect(isEncodedURIComponent("foo+bar")).toBe(false);
        expect(isEncodedURIComponent("test=value")).toBe(false);
        expect(isEncodedURIComponent("path/to/file")).toBe(false);
        expect(isEncodedURIComponent("query?key=value")).toBe(false);
        expect(isEncodedURIComponent("https://example.com/path")).toBe(false);
        expect(isEncodedURIComponent("user@example.com")).toBe(false);
        expect(isEncodedURIComponent("normal-string")).toBe(false);
      });

      it("should return false for strings with natural percent signs", () => {
        expect(isEncodedURIComponent("100%")).toBe(false);
        expect(isEncodedURIComponent("50% off")).toBe(false);
        expect(isEncodedURIComponent("90% complete")).toBe(false);
        expect(isEncodedURIComponent("file%name.txt")).toBe(false);
        expect(isEncodedURIComponent("test%case")).toBe(false);
      });
    });

    describe("Invalid percent encoding", () => {
      it("should return false for strings with invalid percent encoding", () => {
        expect(isEncodedURIComponent("hello%XXworld")).toBe(false);
        expect(isEncodedURIComponent("test%")).toBe(false);
        expect(isEncodedURIComponent("%")).toBe(false);
        expect(isEncodedURIComponent("100%")).toBe(false);
        expect(isEncodedURIComponent("hello%G0world")).toBe(false);
        expect(isEncodedURIComponent("test%ZZvalue")).toBe(false);
        expect(isEncodedURIComponent("%1")).toBe(false);
        expect(isEncodedURIComponent("%XY")).toBe(false);
        expect(isEncodedURIComponent("start%")).toBe(false);
        expect(isEncodedURIComponent("%end")).toBe(false);
        expect(isEncodedURIComponent("%%")).toBe(false);
      });

      it("should return false for incomplete percent sequences", () => {
        expect(isEncodedURIComponent("hello%2")).toBe(false);
        expect(isEncodedURIComponent("test%A")).toBe(false);
        expect(isEncodedURIComponent("%F")).toBe(false);
        expect(isEncodedURIComponent("value%3")).toBe(false);
      });
    });

    describe("Input validation", () => {
      it("should return false for non-string inputs", () => {
        expect(isEncodedURIComponent(null)).toBe(false);
        expect(isEncodedURIComponent(undefined)).toBe(false);
        expect(isEncodedURIComponent(123)).toBe(false);
        expect(isEncodedURIComponent(0)).toBe(false);
        expect(isEncodedURIComponent(true)).toBe(false);
        expect(isEncodedURIComponent(false)).toBe(false);
        expect(isEncodedURIComponent({})).toBe(false);
        expect(isEncodedURIComponent([])).toBe(false);
        expect(isEncodedURIComponent(() => {})).toBe(false);
        expect(isEncodedURIComponent(new Date())).toBe(false);
      });

      it("should handle empty and whitespace strings", () => {
        expect(isEncodedURIComponent("")).toBe(false);
        expect(isEncodedURIComponent("   ")).toBe(false);
        expect(isEncodedURIComponent("\t\n")).toBe(false);
      });
    });

    describe("Edge cases and special scenarios", () => {
      it("should handle single encoded characters", () => {
        expect(isEncodedURIComponent("%20")).toBe(true); // Just a space
        expect(isEncodedURIComponent("%2B")).toBe(true); // Just a plus
        expect(isEncodedURIComponent("%3D")).toBe(true); // Just an equals
        expect(isEncodedURIComponent("%40")).toBe(true); // Just an at symbol
      });

      it("should handle multiple encoded sequences", () => {
        expect(isEncodedURIComponent("a%20b%20c")).toBe(true); // Multiple encoded spaces
        expect(isEncodedURIComponent("hello%20world%21")).toBe(true); // Space and exclamation
        expect(
          isEncodedURIComponent("%3Cdiv%3E%20content%20%3C%2Fdiv%3E")
        ).toBe(true); // HTML-like
      });

      it("should handle encoded percent signs", () => {
        expect(isEncodedURIComponent("100%25")).toBe(true); // Encoded percent sign
        expect(isEncodedURIComponent("50%25%20off")).toBe(true); // Encoded percent and space
      });

      it("should handle mixed encoded and unencoded content", () => {
        expect(isEncodedURIComponent("hello%20world!")).toBe(true); // Mixed
        expect(isEncodedURIComponent("user%40domain.com/path")).toBe(true); // Mixed with slashes
        expect(isEncodedURIComponent("query%3Dvalue&other=normal")).toBe(true); // Mixed in query
      });
    });

    describe("Double and multiple encoding", () => {
      it("should detect double encoding", () => {
        // Single encoded: "hello world" -> "hello%20world"
        expect(isEncodedURIComponent("hello%20world")).toBe(true);

        // Double encoded: "hello%20world" -> "hello%2520world"
        expect(isEncodedURIComponent("hello%2520world")).toBe(true);

        // Triple encoded would be: "hello%252520world"
        expect(isEncodedURIComponent("hello%252520world")).toBe(true);
      });

      it("should handle complex double encoding scenarios", () => {
        expect(isEncodedURIComponent("path%252Fto%252Ffile")).toBe(true);
        expect(isEncodedURIComponent("user%2540domain.com")).toBe(true);
        expect(
          isEncodedURIComponent("query%253Dvalue%2526other%253Dtest")
        ).toBe(true);
      });
    });

    describe("Real-world URL scenarios", () => {
      it("should handle encoded URL components", () => {
        expect(
          isEncodedURIComponent(
            "https%3A%2F%2Fexample.com%2Fpath%20with%20spaces"
          )
        ).toBe(true);
        expect(
          isEncodedURIComponent("user%40example.com%3Apassword%40server.com")
        ).toBe(true);
        expect(
          isEncodedURIComponent("%2Fabsolute%2Fpath%2Fto%2Ffile.txt")
        ).toBe(true);
      });

      it("should handle encoded query parameters", () => {
        expect(isEncodedURIComponent("key1%3Dvalue1%26key2%3Dvalue2")).toBe(
          true
        );
        expect(
          isEncodedURIComponent("search%3Dhello%20world%26filter%3Dactive")
        ).toBe(true);
        expect(
          isEncodedURIComponent("redirect%3Dhttps%253A%252F%252Fexample.com")
        ).toBe(true);
      });

      it("should handle encoded path segments", () => {
        expect(
          isEncodedURIComponent("folder%2Fsubfolder%2Ffile%20name.txt")
        ).toBe(true);
        expect(isEncodedURIComponent("user%40host%3Aport%2Fpath")).toBe(true);
        expect(isEncodedURIComponent("%7B%22key%22%3A%22value%22%7D")).toBe(
          true
        ); // JSON-like
      });
    });

    describe("Unicode and international characters", () => {
      it("should handle encoded Unicode characters", () => {
        expect(isEncodedURIComponent("caf%C3%A9")).toBe(true); // café
        expect(isEncodedURIComponent("na%C3%AFve")).toBe(true); // naïve
        expect(isEncodedURIComponent("%E4%BD%A0%E5%A5%BD")).toBe(true); // 你好 (Chinese)
        expect(
          isEncodedURIComponent("%D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82")
        ).toBe(true); // Привет (Russian)
      });

      it("should return false for unencoded Unicode", () => {
        expect(isEncodedURIComponent("café")).toBe(false);
        expect(isEncodedURIComponent("naïve")).toBe(false);
        expect(isEncodedURIComponent("你好")).toBe(false);
        expect(isEncodedURIComponent("Привет")).toBe(false);
      });
    });

    describe("Performance and boundary cases", () => {
      it("should handle very long strings", () => {
        const longEncoded = "a%20".repeat(1000) + "z"; // 1000 encoded spaces
        const longUnencoded = "a ".repeat(1000) + "z"; // 1000 unencoded spaces

        expect(isEncodedURIComponent(longEncoded)).toBe(true);
        expect(isEncodedURIComponent(longUnencoded)).toBe(false);
      });

      it("should handle strings with many percent signs", () => {
        const manyPercents = "10%20%30%40%50%60%70%80%90%100%";
        expect(isEncodedURIComponent(manyPercents)).toBe(false); // Invalid encodings
      });

      it("should handle alternating encoded/unencoded", () => {
        expect(isEncodedURIComponent("hello%20world%21normal")).toBe(true);
        expect(isEncodedURIComponent("normal%20text%21more")).toBe(true);
      });
    });

    describe("Special character combinations", () => {
      it("should handle URL-reserved characters", () => {
        expect(isEncodedURIComponent("%3A%2F%2F%3F%23%5B%5D%40")).toBe(true); // :/?#[]@
        expect(isEncodedURIComponent("%21%24%26%27%28%29%2A%2B%2C%3B%3D")).toBe(
          true
        ); // !$&'()*+,;=
        expect(isEncodedURIComponent("%25%2D%2E%5F%7E")).toBe(true); // %-._
      });

      it("should handle encoded whitespace variations", () => {
        expect(isEncodedURIComponent("line%0Abreak")).toBe(true); // \n
        expect(isEncodedURIComponent("tab%09character")).toBe(true); // \t
        expect(isEncodedURIComponent("carriage%0Dreturn")).toBe(true); // \r
        expect(isEncodedURIComponent("form%0Cfeed")).toBe(true); // \f
        expect(isEncodedURIComponent("vertical%0Btab")).toBe(true); // \v
      });
    });

    describe("False positive prevention", () => {
      it("should not be fooled by percent-like patterns", () => {
        expect(isEncodedURIComponent("100%")).toBe(false);
        expect(isEncodedURIComponent("50.5%")).toBe(false);
        expect(isEncodedURIComponent("test%case")).toBe(false);
        expect(isEncodedURIComponent("file%name.txt")).toBe(false);
        expect(isEncodedURIComponent("100%25%")).toBe(false); // Mixed valid/invalid
      });

      it("should distinguish between similar characters", () => {
        expect(isEncodedURIComponent("hello%20world")).toBe(true); // %20 = space
        expect(isEncodedURIComponent("hello%2Oworld")).toBe(false); // %2O = invalid (O not hex)
        expect(isEncodedURIComponent("hello%2Gworld")).toBe(false); // %2G = invalid (G not hex)
      });
    });
  });
});
