class MixedHelpers
{
    static objectIsEmpty( objectToCheck )
    {
        if(!objectToCheck) return false;
        return Object.keys(objectToCheck).length === 0 && objectToCheck.constructor === Object
    }
}

export default MixedHelpers;
