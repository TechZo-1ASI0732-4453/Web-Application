
export interface CountryDto{
    name: string;
    departments: DepartmentDto[]
}
interface DepartmentDto{
    id: number;
    name: string;
    districts: DistrictDto[];
}
interface DistrictDto {
    id: number;
    name: string;
}
