{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "nixpkgs";
  };

  outputs = { self, nixpkgs }:
    let
      forAllSystems = function:
        nixpkgs.lib.genAttrs [
          "x86_64-linux"
          "aarch64-linux"
        ]
          (system: function nixpkgs.legacyPackages.${system});
    in

    {

      devShells = forAllSystems
        (pkgs: {
          default = pkgs.mkShell {
            packages = [ pkgs.deno pkgs.just ];
            shellHook = ''
              export PUPPETEER_PRODUCT="chrome"
              export PUPPETEER_SKIP_DOWNLOAD="true"
              export PUPPETEER_EXECUTABLE_PATH="${pkgs.chromium}/bin/chromium"
            '';
          };
        });

    };

}
