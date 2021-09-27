let pkgs = import <nixpkgs> {};

in pkgs.mkShell rec {
  name = "stinchbot";

  buildInputs = with pkgs; [
    nodejs-16_x
  ];
}
