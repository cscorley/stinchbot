let pkgs = import <nixpkgs> {};

in pkgs.mkShell rec {
  name = "kqstats";

  buildInputs = with pkgs; [
    nodejs-16_x
  ];
}
