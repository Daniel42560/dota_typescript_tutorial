import { reloadable } from "./lib/tstl-utils";
import { modifier_panic } from "./modifiers/modifier_panic";

const heroSelectionTime = 20;

//- next up: Events für on attack oder so nacgucken und undying in 5 hits sterben lassen

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
    }

    public static Activate(this: void) {
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();

        // Register event listeners for dota engine events
        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        ListenToGameEvent("entity_killed", event => this.OnNpcKilled(event), undefined);

        // Register event listeners for events from the UI
        /*
        CustomGameEventManager.RegisterListener("ui_panel_closed", (_, data) => {
            print(`Player ${data.PlayerID} has closed their UI panel.`);

            // Respond by sending back an example event
            const player = PlayerResource.GetPlayer(data.PlayerID)!;
            CustomGameEventManager.Send_ServerToPlayer(player, "example_event", {
                myNumber: 42,
                myBoolean: true,
                myString: "Hello!",
                myArrayOfNumbers: [1.414, 2.718, 3.142]
            });

            // Also apply the panic modifier to the sending player's hero
            //const hero = player.GetAssignedHero();
            //hero.AddNewModifier(hero, undefined, modifier_panic.name, { duration: 5 });
        });
        */
    }

    private configure(): void {
        GameRules.EnableCustomGameSetupAutoLaunch(true);
        GameRules.SetCustomGameSetupAutoLaunchDelay(0);
        GameRules.SetHeroSelectionTime(10);
        GameRules.SetStrategyTime(0);
        GameRules.SetPreGameTime(0);
        GameRules.SetShowcaseTime(0);
        GameRules.SetPostGameTime(5);
              

        GameRules.SetShowcaseTime(0);
        GameRules.SetHeroSelectionTime(heroSelectionTime);
    }
    public OnStateChange(): void {
        const state = GameRules.State_Get();

        // Add 4 bots to lobby in tools
        /*
        if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
            for (let i = 0; i < 4; i++) {
                Tutorial.AddBot("npc_dota_hero_lina", "", "", false);
            }
        }
        */

        if (state === GameState.CUSTOM_GAME_SETUP) {
            // Automatically skip setup in tools
            if (IsInToolsMode()) {
                Timers.CreateTimer(3, () => {
                    GameRules.FinishCustomGameSetup();
                });
            }
        }

        // Start game once pregame hits
        if (state === GameState.PRE_GAME) {
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }
    private StartGame(): void {
        print("Game starting!");

        const gm: CDOTABaseGameMode = GameRules.GetGameModeEntity();
        gm.SetCustomAttributeDerivedStatValue(AttributeDerivedStats.STRENGTH_HP_REGEN, 0);
        gm.SetFogOfWarDisabled(true);

        this.SpawnEnemyInRow("npc_dota_hero_undying", 1);
    }
    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }
    private OnNpcSpawned(event: NpcSpawnedEvent) {
        // After a hero unit spawns, apply modifier_panic for 8 seconds
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
        // Give all real heroes (not illusions) the meepo_earthbind_ts_example spell
        if (unit.IsRealHero()) {
            if(unit.GetTeam() === DotaTeam.BADGUYS){
                //this.GetInitialTargetForEntity(unit);
            }
        }
    }
    private OnNpcKilled(event: EntityKilledEvent){

    }
    private SpawnEnemyInRow(entity : string, row : number){
        const spawn_vector_ent = Entities.FindByName(undefined, "target_row_1_right") as CBaseEntity;
        // GetAbsOrigin() is a function that can be called on any entity to get its location
        let spawn_vector = spawn_vector_ent.GetAbsOrigin();
        // Spawn the unit at the location on the neutral team
        const spawnedUnit = CreateUnitByName(entity, spawn_vector, true, undefined, undefined, DotaTeam.NEUTRALS);
        

        const aggro = Entities.FindByName(undefined, "target_row_1_left") as CBaseEntity;
        let aggro_pos = aggro.GetAbsOrigin();
        
        Timers.CreateTimer(3, () => {
            spawnedUnit.MoveToPositionAggressive(aggro_pos);
        })
    }
    private GetInitialTargetForEntity(unit : CDOTA_BaseNPC){
        const row = this.GetEntityRow(unit);
        
        const left_pos = (Entities.FindByName(undefined, "target_row_1_left") as CBaseEntity).GetAbsOrigin();
        const right_pos = (Entities.FindByName(undefined, "target_row_1_right") as CBaseEntity).GetAbsOrigin();
        //let units = FindUnitsInLine(DotaTeam.GOODGUYS, left_pos, right_pos, undefined, 20, UnitTargetTeam.FRIENDLY, UnitTargetType.ALL, UnitTargetFlags.NONE);
        unit.MoveToPositionAggressive(left_pos);
    }
    private GetEntityRow(unit : CDOTA_BaseNPC) : number{
        return 0;
    }
}
