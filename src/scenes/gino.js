PP.scenes.add("gino", preload, create, update, destroy);

const NERO = "0x000000";

const A_TERRENO = 96;
const Y_TERRENO = 624;
const X_GINO = 200;
const L_GINO = 81;
const A_GINO = 84;
const L_FUNGO = 90;
const A_FUNGO = 63;
const L_LIVELLO = 3840;
const L_PIATTAFORMA = 192;
const A_PIATTAFORMA = 21;
const X_PIATTAFORMA = 1740;
const Y_PIATTAFORMA = 456;
const L_BANDIERA = 90;
const A_BANDIERA = 138;
const X_BANDIERA = L_LIVELLO - 100;

const TASTO_SALTO = PP.key_codes.SPACE;
const TASTO_FUOCO = PP.key_codes.F;

const VEL_CORSA = 400;
const VEL_SALTO = 1000;
const DISTANZA_MAX = 600;
const VEL_INIZIALE = 400;
const ACCELERAZIONE = 20;
const VEL_FUOCO = 600;
const VEL_FUNGO = 100;
const TASTO_SX = PP.key_codes.LEFT;
const TASTO_DX = PP.key_codes.RIGHT;

const PARALLAX_NUVOLE = 0.2;
const PARALLAX_COLLINE = 0.4;
const PARALLAX_CESPUGLI = 0.7;

const X_FUNGHI = [900, 1700, 1800, 2600, 3100];


let gino;

let fungo;

let terreno;

let vel_fungo = VEL_INIZIALE;

let partita_finita = false;

let testo_fine;

let testo_rigioca;

let fuoco = null;

let funghi

let nuvole;

let colline;

let cespugli;



let ss_gino;
let ss_fungo;
let animazione;

let img_sfondo;
let img_terreno;
let img_piattaforma;
let img_gino;
let img_fungo;
let img_fuoco;
let img_bandiera;
let img_nuvole;
let img_colline;
let img_cespugli;


function preload(s) {
    img_sfondo = PP.assets.image.load(s,
    "./assets/images/sfondo.png");
    img_nuvole = PP.assets.image.load(s,
    "assets/images/nuvole.png");
    img_colline = PP.assets.image.load(s,
    "assets/images/colline.png");
    img_cespugli = PP.assets.image.load(s,
    "assets/images/cespugli.png");
    img_terreno = PP.assets.image.load(s,
    "./assets/images/terreno.png");
    img_piattaforma = PP.assets.image.load(s,
    "./assets/images/piattaforma.png");
    img_bandiera = PP.assets.image.load(s,
    "./assets/images/bandiera.png");
    img_fungo = PP.assets.image.load(s,
    "./assets/images/fungo.png");
    img_fuoco = PP.assets.image.load(s,
    "./assets/images/fuoco.png");
    ss_gino = PP.assets.sprite.load_spritesheet(s,
    "assets/images/gino_spritesheet.png",
    L_GINO, A_GINO);
    ss_fungo = PP.assets.sprite.load_spritesheet(s,
    "assets/images/fungo_spritesheet.png",
    L_FUNGO, A_FUNGO);
}

function update(s) {
    if (partita_finita) {
        if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)) {
    ricomincia(s);
    }
    return;
    }
    salta(s);
    cammina(s);
    controlla_fungo();
    spara(s);
    controlla_fuoco();
    anima_gino();
    muovi_sfondo(s);
}

function muovi_sfondo(s) {
    let x = PP.camera.get_scroll_x(s);
    nuvole.tile_geometry.x = x * PARALLAX_NUVOLE;
    colline.tile_geometry.x = x * PARALLAX_COLLINE;
    cespugli.tile_geometry.x = x * PARALLAX_CESPUGLI;
}

function anima_gino() {
    let nuova = "fermo";
    if (!PP.physics.is_on_ground(gino)) {
    nuova = "salto";
    } else if (PP.physics.get_velocity_x(gino) !== 0) {
    nuova = "corsa";
    }
    PP.assets.sprite.animation_play(gino, nuova);
    if (nuova !== animazione) {
    animazione = nuova;
    PP.assets.sprite.animation_play(gino, animazione);
}
}

function controlla_fungo() {
if (fungo.geometry.body_x < -L_FUNGO) {
resetta_fungo();
}
}


function controlla_fuoco() {
if (fuoco !== null && fuoco.geometry.body_x > LARGHEZZA) {
PP.assets.destroy(fuoco);
fuoco = null;
}
}

function ricomincia(s) {
if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO))  {
partita_finita = false;
vel_fungo = VEL_INIZIALE;
resetta_fungo();
testo_fine.visibility.hidden = true;
testo_rigioca.visibility.hidden = true;
}
}

function salta(s) {
    if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)
    && PP.physics.is_on_ground(gino)) {
    PP.physics.set_velocity_y(gino, -VEL_SALTO);
    }
}

function cammina(s) {
    if (PP.interactive.kb.is_key_down(s, TASTO_SX)) {
    PP.physics.set_velocity_x(gino, -VEL_CORSA);
    gino.geometry.flip_x = true;
    } else if (PP.interactive.kb.is_key_down(s, TASTO_DX)) {
    PP.physics.set_velocity_x(gino, VEL_CORSA);
    gino.geometry.flip_x = false;
    } else {
    PP.physics.set_velocity_x(gino, 0);
    }
}

function spara(s) {
if (fuoco === null &&
PP.interactive.kb.is_key_just_down(s, TASTO_FUOCO)) {
if (PP.interactive.kb.is_key_just_down(s, TASTO_FUOCO)) {
fuoco = PP.assets.image.add(s, img_fuoco,
gino.geometry.body_x - 15 + L_GINO,
gino.geometry.body_y - 12 + A_GINO / 4, 0.5, 0.5);
PP.physics.add(s, fuoco, PP.physics.type.DYNAMIC);
PP.physics.set_velocity_x(fuoco, VEL_FUOCO);
PP.physics.add_collider(s, fuoco, terreno);
PP.physics.set_bounce_y(fuoco, 1);
PP.physics.add_overlap_f(s, fuoco, fungo, brucia);
}
}
}

function brucia(s, a, b) {
PP.assets.destroy(a);
fuoco = null;
resetta_fungo();
}

function resetta_fungo() {
fungo.geometry.x = LARGHEZZA + L_FUNGO / 2 +
Math.random() * DISTANZA_MAX;
PP.physics.set_velocity_x(fungo, -vel_fungo);
}

function create(s) {
    PP.assets.image.add(s, img_sfondo, 0, 0, 0, 0);
    partita_finita = false;
    let sfondo = PP.assets.image.add(s, img_sfondo,
    0, 0, 0, 0);
    sfondo.tile_geometry.scroll_factor_x = 0;
    crea_sfondo(s);
    funghi = [];
    crea_terreno(s);
    crea_gino(s);
    crea_fungo(s);
    crea_funghi(s);
    crea_camera(s);
    crea_piattaforma(s);
    crea_fine(s);
    crea_bandiera(s);
    animazione = "";
}

function crea_sfondo(s) {
    nuvole = crea_layer(s, img_nuvole);
    colline = crea_layer(s, img_colline);
    cespugli = crea_layer(s, img_cespugli);
}

function crea_layer(s, img) {
    let layer = PP.assets.tilesprite.add(s, img,
    0, 0, LARGHEZZA, ALTEZZA, 0, 0);
    layer.tile_geometry.scroll_factor_x = 0;
    return layer;
}

function crea_terreno(s) {
    terreno = PP.assets.tilesprite.add(s, img_terreno,
    0, Y_TERRENO, L_LIVELLO, A_TERRENO, 0, 0);
    PP.physics.add(s, terreno, PP.physics.type.STATIC);
}

function crea_gino(s) {
    gino = PP.assets.sprite.add(s, ss_gino,
    X_GINO, Y_TERRENO - A_GINO / 2, 0.5, 0.5);
    PP.physics.add(s, gino, PP.physics.type.DYNAMIC);
    PP.physics.set_collide_world_bounds(gino, true);
    PP.physics.add_collider(s, gino, terreno);
    PP.physics.set_velocity_y(gino, -1000);
    PP.physics.set_collision_rectangle(gino, 51, 72, 15, 12);
    PP.assets.sprite.animation_add(gino, "fermo",
    0, 0, 1, 0);
    PP.assets.sprite.animation_add(gino, "corsa",
    1, 12, 20, -1);
    PP.assets.sprite.animation_add(gino, "salto",
    13, 13, 1, 0);
}

function crea_fungo(s) {
    fungo = PP.assets.image.add(s, img_fungo,
    LARGHEZZA * 3 / 4, Y_TERRENO - A_FUNGO / 2, 0.5, 0.5);
    PP.physics.add(s, fungo, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(fungo, false);
    PP.physics.set_velocity_x(fungo, -vel_fungo);
    PP.physics.add_overlap_f(s, gino, fungo, fine_partita)
}

function crea_funghi(s) {
    for (let i = 0; i < X_FUNGHI.length; i++) {
    let f = PP.assets.sprite.add(s, ss_fungo,
    X_FUNGHI[i], Y_TERRENO - A_FUNGO / 2, 0.5, 0.5);
    PP.physics.add(s, f, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(f, false);
    PP.physics.set_velocity_x(f, -VEL_FUNGO);
    PP.physics.add_overlap_f(s, gino, f, fine_partita);
    PP.assets.sprite.animation_add(f, "cammina",
    0, 15, 20, -1);
    PP.assets.sprite.animation_play(f, "cammina");
    funghi.push(f);
    }
}

function crea_piattaforma(s) {
    let piattaforma = PP.assets.image.add(s, img_piattaforma,
    X_PIATTAFORMA, Y_PIATTAFORMA, 0.5, 0.5);
    PP.physics.add(s, piattaforma, PP.physics.type.STATIC);
    PP.physics.add_collider(s, gino, piattaforma);
}

function crea_camera(s) {
    PP.physics.set_world_bounds(s, 0, 0, L_LIVELLO, ALTEZZA);
    PP.camera.set_bounds(s, 0, 0, L_LIVELLO, ALTEZZA);
    PP.camera.start_follow(s, gino, 0, 0);
}

function crea_bandiera(s) {
    let bandiera = PP.assets.image.add(s, img_bandiera,
    X_BANDIERA, Y_TERRENO - A_BANDIERA / 2, 0.5, 0.5);
    PP.physics.add(s, bandiera, PP.physics.type.STATIC);
    PP.physics.add_overlap_f(s, gino, bandiera, vittoria);
}

function vittoria(s, a, b) {
    partita_finita = true;
    PP.scenes.start("fine");
}

function termina(messaggio) {
    partita_finita = true;
    PP.game_state.set_variable("messaggio", messaggio);
    PP.scenes.start("fine");
}

function crea_fine(s) {
testo_fine = PP.shapes.text_styled_add(s,
LARGHEZZA / 2, 
ALTEZZA / 3, 
"GAME OVER",
64, 
"Arial", 
"bold", NERO, 
null, 
0.5, 
0.5);
testo_fine.visibility.hidden = true;
testo_rigioca = PP.shapes.text_styled_add(s,
LARGHEZZA / 2, 
ALTEZZA / 2, 
"RIGIOCA (SPAZIO)",
40, 
"Arial", 
"bold", 
NERO, 
null, 
0.5, 
0.5
);
testo_rigioca.visibility.hidden = true;
}

function fine_partita(s, a, b) {
partita_finita = true;
PP.physics.set_velocity_x(a, 0);
PP.physics.set_velocity_x(b, 0);
PP.scenes.start("fine");
console.log("colpito!");
testo_fine.visibility.hidden = false;
testo_rigioca.visibility.hidden = false;
}

function destroy(s) {

}
