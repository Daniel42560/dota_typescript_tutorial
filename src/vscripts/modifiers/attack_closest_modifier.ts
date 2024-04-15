import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class attack_closest_modifier extends BaseModifier{

    caster: CDOTA_BaseNPC = this.GetCaster()!;
    modifier_name: string = "";

    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK]
    }
    OnAttack(event: ModifierAttackEvent): void {

        if (event.attacker.HasModifier("row_1_modifier")){
            this.modifier_name = "row_1_modifier";
        }
        if (event.attacker.HasModifier("row_2_modifier")){
            this.modifier_name = "row_2_modifier";
        }
        if (event.attacker.HasModifier("row_3_modifier")){
            this.modifier_name = "row_3_modifier";
        }
        if (event.attacker.HasModifier("row_4_modifier")){
            this.modifier_name = "row_4_modifier";
        }

        let units = FindUnitsInRadius(DotaTeam.BADGUYS, Vector(0,0,0), undefined, FIND_UNITS_EVERYWHERE, UnitTargetTeam.BOTH, UnitTargetType.ALL, UnitTargetFlags.NONE, FindOrder.CLOSEST, false);
        let target: CDOTA_BaseNPC = event.target;
        for(let unit of units){
            if (unit.HasModifier(this.modifier_name)){
                target = unit;
                break;
            }
        }
        event.attacker.SetForceAttackTarget(target);
        }
}