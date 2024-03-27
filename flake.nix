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
            packages = [ pkgs.deno ];
          };
        });

    };

}
